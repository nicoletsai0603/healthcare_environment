/**
 * 醫療事業環境永續資訊管理系統
 * 互動邏輯 - jQuery 版本
 */

(function ($) {
    'use strict';

    // ------------------------------
    // AOS 初始化
    // ------------------------------
    if (window.AOS) {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: false,
            mirror: true,
            offset: 120
        });
    }

    // ------------------------------
    // DOM Ready
    // ------------------------------
    $(document).ready(function () {

        // ------------------------------
        // 頂部導覽列滾動陰影
        // ------------------------------
        const $header = $('.site-header, .nav_box');
        const $body = $('body');

        function handleScrollState() {
            const isScrolled = $(window).scrollTop() > 100;
            $header.toggleClass('is-scrolled', isScrolled);
            $body.toggleClass('fixed_header', isScrolled);
        }

        $(window).on('scroll', handleScrollState);
        handleScrollState();

        // ------------------------------
        // 手機選單
        // ------------------------------
        const $mMenubar = $('.m-menubar');
        const $mobileMenu = $('#mobileMenu, .mobile-menu');

        function setMenuState(isOpen) {
            $mMenubar.toggleClass('is-active showbar', isOpen);
            $mobileMenu.toggleClass('is-active', isOpen);
            $body.toggleClass('menu-open open_mobile_menu', isOpen);
        }

        // 漢堡選單點擊
        $mMenubar.on('click', function () {
            const isOpen = !$(this).hasClass('is-active');
            setMenuState(isOpen);
        });

        // 關閉按鈕
        $('.close-btn, #closeMenu').on('click', function () {
            setMenuState(false);
        });

        // 點擊連結後關閉選單
        $mobileMenu.on('click', 'a', function () {
            setMenuState(false);
        });

        // ESC 鍵關閉選單
        $(document).on('keydown', function (e) {
            if (e.key === 'Escape') {
                setMenuState(false);
            }
        });

        // ------------------------------
        // 手機版下拉選單
        // ------------------------------
        $('.nav_box .main_area .main_menu .item > a').on('click', function (e) {
            // 只在手機版時處理
            if ($(window).width() < 1200) {
                e.preventDefault();

                const $dropdownMenu = $(this).next('.dropdown-menu');
                const isOpen = $dropdownMenu.hasClass('show');

                // 關閉所有其他的下拉選單
                $('.nav_box .main_area .main_menu .item .dropdown-menu').removeClass('show');
                $('.nav_box .main_area .main_menu .item > a').removeClass('show');

                // 切換當前下拉選單
                if (!isOpen && $dropdownMenu.length) {
                    $dropdownMenu.addClass('show');
                    $(this).addClass('show');
                }
            }
        });

        // ------------------------------
        // 最新公告 Tab 切換
        // ------------------------------
        const $tabLinks = $('.tab-controls .nav-link');
        $tabLinks.on('click', function (e) {
            e.preventDefault();
            const $this = $(this);
            const targetTab = $this.data('tab');

            if ($this.hasClass('active')) {
                return;
            }

            $tabLinks.removeClass('active').attr('aria-selected', 'false');
            $this.addClass('active').attr('aria-selected', 'true');

            $('.tab-panels .tab-panel').removeClass('is-active').attr('hidden', 'hidden');
            $('#' + targetTab).addClass('is-active').removeAttr('hidden');

            if (window.AOS) {
                AOS.refresh();
            }
        });

        // 初始化第一個 tab
        if ($('.tab-controls .nav-link.active').length === 0) {
            const $firstTab = $('.tab-controls .nav-link').first();
            if ($firstTab.length) {
                $firstTab.addClass('active').attr('aria-selected', 'true');
                const firstTabId = $firstTab.data('tab');
                if (firstTabId) {
                    $('.tab-panels .tab-panel').removeClass('is-active').attr('hidden', 'hidden');
                    $('#' + firstTabId).addClass('is-active').removeAttr('hidden');
                }
            }
        }

        // ------------------------------
        // Tab 滑動箭頭功能（視窗小於 864px 時顯示）
        // ------------------------------
        const $tabControlsWrapper = $('.tab-controls-wrapper');
        const $tabControls = $('.tab-controls');
        const $tabArrowLeft = $('.tab-arrow-left');
        const $tabArrowRight = $('.tab-arrow-right');

        function updateTabLayout() {
            const needArrows = $(window).width() < 864;

            if (needArrows) {
                $tabControlsWrapper.addClass('show-arrows');
                updateArrowStates();
            } else {
                $tabControlsWrapper.removeClass('show-arrows');
            }
        }

        function updateArrowStates() {
            if ($tabControlsWrapper.hasClass('show-arrows') && $tabControls.length) {
                const scrollLeft = $tabControls.scrollLeft();
                const scrollWidth = $tabControls[0].scrollWidth;
                const clientWidth = $tabControls[0].clientWidth;

                // 更新左箭頭狀態
                $tabArrowLeft.prop('disabled', scrollLeft <= 0);

                // 更新右箭頭狀態
                $tabArrowRight.prop('disabled', scrollLeft + clientWidth >= scrollWidth - 1);
            }
        }

        // 左箭頭點擊
        $tabArrowLeft.on('click', function () {
            const scrollAmount = 200;
            $tabControls.animate({
                scrollLeft: $tabControls.scrollLeft() - scrollAmount
            }, 300, updateArrowStates);
        });

        // 右箭頭點擊
        $tabArrowRight.on('click', function () {
            const scrollAmount = 200;
            $tabControls.animate({
                scrollLeft: $tabControls.scrollLeft() + scrollAmount
            }, 300, updateArrowStates);
        });

        // 監聽滾動事件更新箭頭狀態
        $tabControls.on('scroll', updateArrowStates);

        // 視窗調整大小時更新佈局
        $(window).on('resize', function () {
            updateTabLayout();
            if ($(window).width() > 1024) {
                setMenuState(false);
            }
            if (window.AOS) {
                AOS.refresh();
            }
        });

        // 初始化佈局
        updateTabLayout();

        // ------------------------------
        // 最新資訊 - 左側圖片輪播
        // ------------------------------
        const $heroSlider = $('.hero-slider');

        if ($heroSlider.length) {
            $heroSlider.each(function () {
                const $slider = $(this);
                const $heroWrapper = $slider.closest('.news-hero');
                const $heroSlides = $slider.find('.hero-slide');
                const $heroDots = $heroWrapper.find('.hero-dot');
                const $heroPrev = $heroWrapper.find('.hero-prev');
                const $heroNext = $heroWrapper.find('.hero-next');
                const SLIDE_INTERVAL = 5000;
                let currentSlide = 0;
                let sliderTimer = null;

                // 單張圖片時不啟動輪播
                if ($heroSlides.length <= 1) {
                    $heroSlides.removeClass('is-active').eq(0).addClass('is-active');
                    $heroDots.removeClass('is-active').attr('aria-pressed', 'false')
                        .eq(0).addClass('is-active').attr('aria-pressed', 'true');
                    return;
                }

                function setSlide(index) {
                    if (!$heroSlides.length) return;

                    const totalSlides = $heroSlides.length;
                    const normalizedIndex = (index + totalSlides) % totalSlides;

                    if (normalizedIndex === currentSlide) return;

                    $heroSlides.removeClass('is-active').eq(normalizedIndex).addClass('is-active');
                    $heroDots.removeClass('is-active').attr('aria-pressed', 'false')
                        .eq(normalizedIndex).addClass('is-active').attr('aria-pressed', 'true');
                    currentSlide = normalizedIndex;
                }

                function nextSlide() {
                    setSlide(currentSlide + 1);
                }

                function prevSlide() {
                    setSlide(currentSlide - 1);
                }

                function startSlider() {
                    stopSlider();
                    sliderTimer = window.setInterval(nextSlide, SLIDE_INTERVAL);
                }

                function stopSlider() {
                    if (sliderTimer) {
                        window.clearInterval(sliderTimer);
                        sliderTimer = null;
                    }
                }

                // 上一張按鈕
                $heroNext.on('click', function () {
                    stopSlider();
                    nextSlide();
                    startSlider();
                });

                // 下一張按鈕
                $heroPrev.on('click', function () {
                    stopSlider();
                    prevSlide();
                    startSlider();
                });

                // 小圓點切換
                $heroDots.on('click', function () {
                    const targetIndex = parseInt($(this).data('slide'), 10);
                    if (!Number.isNaN(targetIndex)) {
                        stopSlider();
                        setSlide(targetIndex);
                        startSlider();
                    }
                });

                // 滑鼠懸停時暫停
                const $heroInteractive = $heroWrapper.find('.hero-slider, .hero-nav, .hero-dot');

                $heroInteractive.on('mouseenter focusin', stopSlider);
                $heroInteractive.on('mouseleave focusout', function () {
                    startSlider();
                });

                // 初始化狀態
                $heroSlides.removeClass('is-active').eq(currentSlide).addClass('is-active');
                $heroDots.removeClass('is-active').attr('aria-pressed', 'false')
                    .eq(currentSlide).addClass('is-active').attr('aria-pressed', 'true');
                startSlider();
            });
        }

        // ------------------------------
        // 數據儀錶板圖片切換
        // ------------------------------
        const $dashboardImg1 = $('#dashboard-img-1');
        const $dashboardImg2 = $('#dashboard-img-2');

        if ($dashboardImg1.length && $dashboardImg2.length) {
            $('#dashboard-img-1, #dashboard-img-2').on('click', function () {
                if ($dashboardImg1.is(':visible')) {
                    $dashboardImg1.fadeOut(200, function () {
                        $(this).removeClass('active');
                        $dashboardImg2.fadeIn(200).addClass('active');
                    });
                } else {
                    $dashboardImg2.fadeOut(200, function () {
                        $(this).removeClass('active');
                        $dashboardImg1.fadeIn(200).addClass('active');
                    });
                }
            });
        }

        // ------------------------------
        // 統計數字動畫
        // ------------------------------
        function animateCounter($element, target, duration = 2000, hasPlus = false, hasPercent = false) {
            let current = 0;
            const increment = target / (duration / 16); // 60fps
            const timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                let displayValue = Math.floor(current);
                if (hasPlus) {
                    $element.text(displayValue + '+');
                } else if (hasPercent) {
                    $element.text(displayValue + '%');
                } else {
                    $element.text(displayValue);
                }
            }, 16);
        }

        // 使用 Intersection Observer 來觸發動畫
        const statObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !$(entry.target).hasClass('animated')) {
                    $(entry.target).addClass('animated');
                    
                    const $statNumbers = $(entry.target).find('.stat-number');
                    
                    $statNumbers.each(function() {
                        const $this = $(this);
                        const text = $this.text().trim();
                        const hasPlus = text.includes('+');
                        const hasPercent = text.includes('%');
                        const numericValue = parseInt(text.replace(/[^0-9]/g, ''));
                        
                        // 清空文字準備動畫
                        $this.text('0' + (hasPlus ? '+' : hasPercent ? '%' : ''));
                        
                        // 延遲啟動動畫，配合 AOS
                        setTimeout(function() {
                            animateCounter($this, numericValue, 2000, hasPlus, hasPercent);
                        }, 300);
                    });
                }
            });
        }, {
            threshold: 0.3
        });

        // 觀察所有統計卡片
        $('.cases-stats').each(function() {
            statObserver.observe(this);
        });

        // ------------------------------
        // 回到頂端按鈕
        // ------------------------------
        const $scrollTopBtn = $('.scroll-top-btn, .go_to_top');

        function handleScrollTopVisibility() {
            const shouldShow = $(window).scrollTop() > 300;
            $scrollTopBtn.toggleClass('is-visible visible', shouldShow);
        }

        $(window).on('scroll', handleScrollTopVisibility);
        handleScrollTopVisibility();

        $scrollTopBtn.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 600);
        });

        // ------------------------------
        // 錨點平滑捲動
        // ------------------------------
        $('a[href^="#"]').on('click', function (e) {
            const hash = $(this).attr('href');

            if (hash === '#' || hash === '' || hash === '#!') return;

            const $target = $(hash);
            if ($target.length === 0) return;

            e.preventDefault();
            setMenuState(false);

            const headerHeight = $header.outerHeight() || 0;
            const offsetTop = $target.offset().top - headerHeight - 16;

            $('html, body').animate({
                scrollTop: offsetTop
            }, 600);
        });

        // ------------------------------
        // 搜尋功能
        // ------------------------------
        const $searchBtn = $('li.search_btn a, .search-btn');
        const $searchBox = $('.search_box, .search-container');

        $searchBtn.on('click', function (e) {
            e.preventDefault();
            $searchBox.toggleClass('is-active');
            $body.toggleClass('search-open');
        });

        // ------------------------------
        // 主選單判斷調整二行
        // ------------------------------
        const $accordion = $('#accordionBox');
        const $accordionItems = $('.nav_box .main_menu .item');

        if ($accordionItems.length > 8) {
            $accordion.addClass('item_column');
        } else {
            $accordion.removeClass('item_column');
        }

        // ------------------------------
        // 主選單的下拉判斷調整兩欄
        // ------------------------------
        $accordionItems.each(function () {
            const $ul = $(this).find('ul');

            if ($ul.length) {
                const optionsCount = $ul.find('li').length;

                if (optionsCount > 8) {
                    $(this).addClass('grid_item');
                } else {
                    $(this).removeClass('grid_item');
                }
            }
        });

        // ------------------------------
        // 延遲載入圖片
        // ------------------------------
        if ('loading' in HTMLImageElement.prototype) {
            $('img[loading="lazy"]').each(function () {
                const dataSrc = $(this).data('src');
                if (dataSrc) {
                    $(this).attr('src', dataSrc);
                }
            });
        }

        // ------------------------------
        // 載入完成後刷新 AOS
        // ------------------------------
        $(window).on('load', function () {
            if (window.AOS) {
                AOS.refresh();
            }

            // 處理 URL hash
            if (window.location.hash) {
                const $target = $(window.location.hash);
                if ($target.length) {
                    setTimeout(function () {
                        const headerHeight = $header.outerHeight() || 0;
                        $('html, body').animate({
                            scrollTop: $target.offset().top - headerHeight - 16
                        }, 600);
                    }, 120);
                }
            }
        });

        // ------------------------------
        // Console 日誌
        // ------------------------------
        console.group('%cMedical Sustainability Portal', 'color: #2A6F8F; font-weight: 600;');
        console.log('✅ jQuery 版本已載入');
        console.log('✅ 導覽列滾動效果已啟用');
        console.log('✅ 手機選單已就緒');
        console.log('✅ Tab 切換功能已綁定');
        console.log('✅ 圖片輪播功能已啟用');
        console.log('✅ 回到頂端按鈕已啟用');
        console.log('✅ 錨點平滑捲動已啟用');
        if (window.AOS) {
            console.log('✅ AOS 動畫初始化完成');
        }
        console.groupEnd();
    });

})(jQuery);
