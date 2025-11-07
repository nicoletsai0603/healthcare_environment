$(document).ready(function(e) {





    $(window).scroll(function() {
        var winWidth = $(window).width(),
            topWindow = $(window).scrollTop();
        if (topWindow > 0 && winWidth > 787) {
            $('header').addClass("small animated fadeInDown");
            $('.eems_color').addClass("none");
        } else {
            $('header').removeClass("small animated fadeInDown ");
            $('.eems_color').removeClass("none");
        }
    });
    $(window).scroll(function() {
        var winWidth = $(window).width(),
            topWindow = $(window).scrollTop();
        if (topWindow = 0 && topWindow > 0 && winWidth < 787) {
            $('header').addClass("small animated fadeInDown");
        }
    });
    $("#mobile_menu_labIcon").click(function() {

        $(".portfolio-filter").toggleClass("on");
        $('.hamburger').toggleClass('is-active');
        $('#greybg ').toggleClass('on');
        $("body").toggleClass("no-scroll");
        if ($("#greybg").hasClass("on")) {
            $("body").addClass("no-scroll");
        }

        if ($(".hamburger").hasClass("is-active")) {

            $('.nav_menu .nsdnmenu .hasChild').css('display', 'none');
        }

    });


    $("#greybg").click(function() {
        $('#greybg,.portfolio-filter ').removeClass('on');
        $("body").removeClass("no-scroll");
        $('.hamburger').removeClass('is-active');

    });
    /*轉盤動畫 */

    var winWidth = $(window).width();
    if (winWidth < 1154) {
        $('.Topic_list_menu>div').css('display', 'none');
        $(".nav_menu>li.nsdnmenu ").click(function() {

            // $(this).children(".hasChild").css('display', 'block');


        });
    } else {
        $('.Topic_list_menu>div').css('display', 'block');

    }


});
$(".list_menu").click(function() {
    $('.Topic_list_menu>div ').slideToggle();

});


// 關閉選單的時候，navbar 上下箭頭恢復原狀 (清除 expanded 的 css)
$(document).on("click", function(event) {
    if (!$(event.target).closest(".nav_menu").length) {
        $(".nav_menu li.nsdnmenu").removeClass("expanded");
        $(".nav_menu .navmenu3").removeClass("expanded");
    }
});

// 依據螢幕寬度調整 navbar 的顯示，選單下拉的箭頭也會跟著調整
$(window).on('resize', function() {
    var winWidth = $(window).width();

    if (winWidth < 1154) {
        $('.Topic_list_menu>div').css('display', 'none');
        $('.nav_menu .navmenu3').removeClass('desktop').removeClass('changed').removeClass('expanded');

        $(".nav_menu > li.nsdnmenu > a").unbind('click').click(function(event) {
            event.stopPropagation();
            const hasChild = $(this).siblings(".hasChild");
            hasChild.stop().slideToggle(300, function() {
                // 依據選單是開啟或關閉來決定是否加上 expanded (箭頭指上或指下)
                if (hasChild.is(":visible")) {
                    //   closest() 方法返回被选元素的第一个祖先元素
                    $(this).closest("li.nsdnmenu").addClass("expanded");
                } else {
                    $(this).closest("li.nsdnmenu").removeClass("expanded");
                }
            });
        });

        $(".nav_menu .navmenu3").unbind('click').click(function(event) {
            event.stopPropagation();
            const hasChild = $(this).siblings(".hasChild");
            let currentNavmenu3 = $(this); // 儲存當下點擊的 navmenu3

            hasChild.stop().slideToggle(300, function() {
                if (hasChild.is(":visible")) {
                    currentNavmenu3.addClass("expanded");
                } else {
                    currentNavmenu3.removeClass("expanded");
                }
            });

        });

        $(".nav_menu .Click_menu li").unbind('click').click(function(event) {
            event.stopPropagation();
            $(".nav_menu .hasChild").slideUp(300);

            $('#greybg, .portfolio-filter').removeClass('on');
            $('.hamburger').removeClass('is-active');
        });

    } else {
        $('.Topic_list_menu>div').css('display', 'block');
        $(".nav_menu>li.nsdnmenu>a").off('click');
        $(".nav_menu .navmenu3").addClass('desktop');
        $(".nav_menu .navmenu3").each(function() {
            const navText = $(this).text(); // 获取当前元素的文字内容
            if (navText.length >= 5) {
                $(this).addClass("changed");
            }
        });
    }
});




//top
var offset = 100,
    offset_opacity = 1200,
    scroll_top_duration = 700,
    $back_to_top = $('.cd-top');
$(window).scroll(function() {
    ($(this).scrollTop() > offset) ? $back_to_top.addClass('cd-is-visible'): $back_to_top.removeClass('cd-is-visible cd-fade-out');
    if ($(this).scrollTop() > offset_opacity) {
        $back_to_top.addClass('cd-fade-out');
    }
});
$back_to_top.on('click',
    function(event) {
        event.preventDefault();
        $('body,html').animate({
                scrollTop: 0,
            },
            scroll_top_duration);
    });

// 輪播的 tab 設定
function TabSlideShow(e, id, next, total) {
    if (e.keyCode == 9) {
        if (next + 1 <= total) {
            $(".carousel-" + (next + 1)).click();
        }
    }
    if (e.keyCode == 13) {
        if (id > 0) {
            location.href = "information/Detail.aspx?id=" + id;
        }
    }
}
$(document).ready(function() {
    var links = $(".Topic_list_menu ul li a");
    var sections = $(".school_inside2 a");

    // 點擊事件處理程序
    links.click(function() {
        // 移除所有連結和錨點的 active 樣式
        links.removeClass("active");
        sections.removeClass("active");

        // 將當前點擊的連結和相應的錨點添加 active 樣式
        $(this).addClass("active");
        $($(this).attr("href")).addClass("active");

        // 使用動畫效果平滑滾動到目標位置
        $("html, body").animate({
            scrollTop: $($(this).attr("href")).offset().top - 150
        }, 500); // 調整持續時間（以毫秒為單位）按需調整
    });

    // 初始化第一個連結和相應的錨點為 active
    links.first().trigger("click");

    // 滾動事件處理程序
    $(window).scroll(function() {
        var currentScroll = $(this).scrollTop();

        // 遍歷所有部分
        sections.each(function() {
            var section = $(this);
            var sectionTop = section.offset().top - 200;
            var sectionBottom = sectionTop + section.height();

            // 檢查滾動位置是否在此部分範圍內
            if (currentScroll >= sectionTop && currentScroll <= sectionBottom) {
                // 移除所有連結和錨點的 active 樣式
                links.removeClass("active");
                sections.removeClass("active");

                // 找到與當前部分相關聯的連結並添加 active 樣式
                var targetHref = "#" + section.attr("id");
                links.filter("[href='" + targetHref + "']").addClass("active");
                section.addClass("active");
            }
        });
    });
});


$(document).ready(function() {
    const items = $(".bubble");
    const itemCount = items.length;



    // 根据子元素的数量添加对应的类名
    if (itemCount === 5) {
        items.addClass("");
    } else if (itemCount === 4) {
        items.addClass("bubble_4");
    } else if (itemCount >= 1 && itemCount <= 3) {
        items.removeClass("bubble_4");
    }
});
// 以下偵測左右按鈕
$(document).ready(function() {
    const $bannerContainer = $('.banner_img_btn');
    const $bannerContent = $('.banner_img_btn'); // 假設內容使用不同的 class
    const $leftArrow = $('#left-arrow');
    const $rightArrow = $('#right-arrow');
    const $bannerImgBtn = $('#banner_img_btn');

    let scrollPosition = 0;
    const scrollStep = 200;

    function updateArrowsVisibility() {
        const maxScroll = $bannerContent[0].scrollWidth - $bannerContainer.width();
        const windowWidth = $(window).width();

        if (maxScroll > 1500 || windowWidth > 1500) {
            $leftArrow.hide();
            $rightArrow.hide();
            $bannerContent.css('transform', 'translateX(0)');
            $bannerImgBtn.css('transform', 'translateX(0)');
        } else {
            $leftArrow.toggle(scrollPosition > 0);
            $rightArrow.toggle(scrollPosition < maxScroll);
        }
    }

    // 初始檢查 maxScroll，如果大於 1500 隱藏箭頭
    const initialMaxScroll = $bannerContent[0].scrollWidth - $bannerContainer.width();
    if (initialMaxScroll > 1500) {
        $leftArrow.hide();
        $rightArrow.hide();
    } else {
        updateArrowsVisibility();
    }

    $leftArrow.on('click', function() {
        scrollPosition -= scrollStep;
        scrollPosition = Math.max(scrollPosition, 0);
        $bannerContent.css('transform', 'translateX(' + -scrollPosition + 'px)');
        updateArrowsVisibility();
    });

    $rightArrow.on('click', function() {
        scrollPosition += scrollStep;
        const maxScroll = $bannerContent[0].scrollWidth - $bannerContent[0].clientWidth;
        scrollPosition = Math.min(scrollPosition, maxScroll);
        $bannerContent.css('transform', 'translateX(' + -scrollPosition + 'px)');
        updateArrowsVisibility();
    });

    $(window).on('resize', function() {
        updateArrowsVisibility();
    });
});



//   快捷鍵
$(document).ready(function() {
    $(".toggle-submenu").click(function() {
        var submenu = $(this).next("ul");
        submenu.slideToggle();
    });
});