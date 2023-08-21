// ==UserScript==
// @name         BiliBili界面高自由度自定义显示
// @namespace    https://github.com/GangChengHuang
// @version      1.2
// @description  BiliBili页面自由定制-主打一个简洁
// @author       Peterg
// @match        https://*.bilibili.com/*
// @icon         http://bilibili.com/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';
    var headerMenuLinks = ['首页', '番剧', '直播', '游戏中心', '会员购', '漫画', '赛事', '下载客户端', '大会员', '消息', '动态', '收藏', '历史', '创作中心'];
    var videoElevators = ['推广', '知识', '游戏', '科技', '运动', '汽车', '生活', '动画', '舞蹈', '音乐', '漫画', '综艺', '国创', '国产原创相关', '番剧', '番剧动态', '课堂', '直播', '美食', '动物圈', '鬼畜', '时尚', '资讯', '娱乐', '专栏', '电影', '电视剧', '影视', '纪录片', '赛事'];
    var channelParts = ['动态', '热门', '频道', '番剧', '电影', '国创', '电视剧', '综艺', '纪录片', '动画', '游戏', '鬼畜', '音乐', '舞蹈', '影视', '娱乐', '知识', '科技', '资讯', '美食', '更多', '生活', '汽车', '时尚', '运动', '动物圈', 'VLOG', '搞笑', '单机游戏', '虚拟UP主', '公益', '公开课', '专栏', '直播', '活动', '课堂', '社区中心', '新歌热榜'];
    var adtexts = ['视频排行榜', '视频热门', '横幅广告', '视频右侧/底部广告', '视频推荐游戏/课程', '视频下方投稿活动', 'bilibili热搜', '页脚网站信息', '空间假装大会员'];
    var videoset = ['解锁3倍速', '解锁4倍速'];
    function setOther(adtexts) {
        if (!GM_getValue('other-' + adtexts[0], false)) {
            GM_addStyle('.video-card-list.is-main{grid-column: span 5 !important}');
            const asides = document.querySelectorAll("section aside");
            for (const aside of asides) {
                aside.remove();
            }
        }
        if (!GM_getValue('other-' + adtexts[1], false)) {
            GM_addStyle('.video-card-list{grid-column: span 5 !important}');
            const asides = document.querySelectorAll("div aside");
            for (const aside of asides) {
                aside.remove();
            }
        }
        if (!GM_getValue('other-' + adtexts[2], false)) {
            setClassDisplayNone(['eva-banner', 'eva-banner-shim']);
        }
        if (!GM_getValue('other-' + adtexts[3], false)) {
            setClassDisplayNone(['ad-report', 'video-card-ad-small']);
        }
        if (!GM_getValue('other-' + adtexts[4], false)) {
            setClassDisplayNone(['video-page-game-card-small', 'video-page-special-card-small']);
        }
        if (!GM_getValue('other-' + adtexts[5], false)) {
            setClassDisplayNone(['activity-m-v1']);
        }
        if (!GM_getValue('other-' + adtexts[6], false)) {
            setClassDisplayNone(['trending']);
        }
        if (!GM_getValue('other-' + adtexts[7], false)) {
            setClassDisplayNone(['bili-footer']);
        }
        if (GM_getValue('other-' + adtexts[8], false)) {
            const viptype = document.querySelector("div.h-vipType.disable");
            if (viptype) {
                viptype.outerHTML = `<div class="h-viplabel"><img src="//i0.hdslb.com/bfs/vip/8d4f8bfc713826a5412a0a27eaaac4d6b9ede1d9.png@1c.webp"></div>`;
            }
        }

    }
    function setClassDisplayNone(classLists) {
        for (const className of classLists) {
            GM_addStyle('.' + className + '{display:none !important}');
        }
    }
    function addSpeed() {
        const ul = document.querySelector('ul.bpx-player-ctrl-playbackrate-menu');
        const speed4 = `<li class="bpx-player-ctrl-playbackrate-menu-item" data-value="4">4.0x</li>`;
        const speed3 = `<li class="bpx-player-ctrl-playbackrate-menu-item" data-value="3">3.0x</li>`;
        if ((!ul) || (!ul.querySelector('[data-value="2"]'))) {
            return;
        }
        if (!ul.querySelector('[data-value="3"]') && (GM_getValue('video-' + videoset[0], false))) {
            ul.insertAdjacentHTML('afterbegin', speed3);
        }
        if (!ul.querySelector('[data-value="4"]') && (GM_getValue('video-' + videoset[1], false))) {
            ul.insertAdjacentHTML('afterbegin', speed4);
        }
    }
    function removeIDsection(idLists) {
        for (const idName of idLists) {
            if (GM_getValue('elevator-' + idName, false)) {
                continue;
            }
            var section = document.querySelector("#" + idName);
            if (!section) {
                continue;
            }
            while (section.tagName !== 'SECTION') {
                section = section.parentNode;
            }
            section.remove();
        }
        const divs = document.querySelectorAll("div.elevator-wrap div.elevator-item");
        for (const div of divs) {
            const span = div.querySelector("span.name");
            if (span && (videoElevators.indexOf(span.textContent) > -1) && (!GM_getValue('elevator-' + span.textContent, false))) {
                div.remove();
            }
        }
        const as = document.querySelectorAll('div.bili-header-channel-panel a');
        for (const a of as) {
            const span = a.querySelector("span.name");
            if (span && (videoElevators.indexOf(span.textContent) > -1) && (!GM_getValue('elevator-' + span.textContent, false))) {
                a.remove();
            }
        }
    }
    function removeCarousel() {//轮播
        const divs = document.querySelectorAll('div.carousel-slide');
        const imgsrc = 'https://s1.hdslb.com/bfs/static/jinkela/long/images/eva.png';
        for (const div of divs) {
            const img = div.querySelector('a > img');
            if (img && (img.src == imgsrc)) {
                div.remove();
            }
        }
    }
    function removeTopLink(topMenuLinks) {//顶部
        var headerBar = document.querySelector('div.bili-header__bar');
        var miniHeader = document.querySelector('div.mini-header');
        var upload = document.querySelector('li.right-entry-item--upload');
        if (upload && (!GM_getValue('header-' + '创作中心', false))) {
            upload.remove();
        }
        if (!headerBar) {
            if (!miniHeader) {
                return;
            }
            headerBar = miniHeader;
        }
        const lis = headerBar.querySelectorAll('li');
        for (const li of lis) {
            const span = li.querySelector("span");
            const a = li.querySelector("a");
            if ((span && (!GM_getValue('header-' + span.textContent, false)) && (topMenuLinks.indexOf(span.textContent) > -1)) || (a && (!GM_getValue('header-' + a.textContent, false)) && (topMenuLinks.indexOf(a.textContent) > -1))) {
                li.remove();
            }
        }
        const divs = headerBar.querySelectorAll('.item');
        for (const div of divs) {
            const span = div.querySelector("span.name");
            if ((span && (!GM_getValue('header-' + span.textContent, false)) && (topMenuLinks.indexOf(span.textContent) > -1))) {
                div.remove();
            }
        }
    }
    function removeContainer(channelParts) {
        var aitems = document.querySelectorAll('a.channel-icons__item');
        for (const a of aitems) {
            const span = a.querySelector("span");
            if (span && (channelParts.indexOf(span.textContent) > -1) && (!GM_getValue('channel-' + span.textContent, false))) {
                a.remove();
            }
        }
        var channelMore = document.querySelector('#channel-entry-more');
        if (channelMore && (!GM_getValue('channel-' + '更多', false))) {
            channelMore.remove();
        }
        var container = document.querySelector('div.right-channel-container');
        if (!container) {
            return;
        }
        var as = container.querySelectorAll('a');
        for (const a of as) {
            if ((channelParts.indexOf(a.textContent) > -1) && (!GM_getValue('channel-' + a.textContent, false))) {
                a.remove();
            }
        }
    }
    function pageMutation() {
        var targetNode = document.querySelector("body");
        var config = { attributes: false, childList: true, subtree: false };
        var callback = function (mutationsList) {
            mutationsList.forEach(function (item, index) {
                removeCarousel();
                removeTopLink(headerMenuLinks);
                removeIDsection(videoElevators);
                removeContainer(channelParts);
                addSpeed();
                setOther(adtexts);
            });
        };
        var observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
    function initSet() {
        GM_addStyle('.bili-header__channel .channel-items__left {grid-template-columns: auto !important}');
        GM_addStyle('.v-popover.is-bottom {left: -200% !important}');
    }
    unsafeWindow.addEventListener('load', () => {
        pageMutation();
        addMinimizeIcon();
    });

    initSet();
    registerMenuCommand();
    function registerMenuCommand() {
        GM_addStyle(`
                    #floating-window {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background-color: #f9f9f9;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
                        width: 700px;
                        min-height: 300px;
                        overflow: hidden;
                        z-index: 9999;
                    }
                    .title-bar {
                        display: flex;
                        align-items: center;
                        background-color: #f9f9f9;
                        height: 40px;
                        padding: 0 16px;
                        border-bottom: 1px solid #ccc;
                    }
                    .div-checkbox {
                        flex-wrap: wrap;
                        display: flex;
                    }
                    .title-bar-text {
                        flex-grow: 1;
                        font-size: 14px;
                        font-weight: bold;
                        text-align: center;
                    }
                    .title-bar-buttons {
                        display: flex;
                        align-items: center;
                    }
                    .tips-text {
                        font-weight: bold;
                        text-align: center;
                    }
                    .title-bar-buttons button {
                        width: 14px;
                        height: 14px;
                        margin-left: 4px;
                        border: none;
                        border-radius: 50%;
                        cursor: pointer;
                    }
                    .minimize-button {
                        background-color: #ffb900;
                    }
                    .maximize-button {
                        background-color: #ff3b30;
                    }
                    .close-button {
                        background-color: #34c759;
                    }
                    .floating-window-content {
                        padding: 16px;
                    }
                    .floating-window-input {
                        display: block;
                        margin-bottom: 8px;
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        background-color: #f2f2f2;
                        color: #333;
                    }
                    .floating-window-textarea {
                        display: block;
                        margin-bottom: 8px;
                        width: 95%;
                        padding: 10px 10px 50px 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        background-color: #f2f2f2;
                        color: #333;
                    }
                    .floating-window-checkbox {
                        margin-bottom: 10px;
                    }
                    .floating-window-button {
                        display: block;
                        margin-bottom: 8px;
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                        font-size: 14px;
                        background-color: #f2f2f2;
                        color: #333;
                    }
                    .resize-handle {
                        position: absolute;
                        bottom: 0;
                        right: 0;
                        width: 16px;
                        height: 16px;
                        background-color: #9e9e9e;
                        cursor: nwse-resize;
                    }
                    #minimized-icon {
                        position: fixed;
                        bottom: 10%;
                        left: 20px;
                        font-size: xxx-large;
                        z-index: initial;
                    }
                    #floating-window.maximized {
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: auto;
                        height: auto;
                        border-radius: 0;
                        box-shadow: none;
                    }
                    .tilink {
                        position: fixed;
                        padding: 1%;
                        text-align: right;
                        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
                    }
                    .tilink ul {
                        list-style: none;
                        padding: 10;
                        margin: 0;
                    }
                    .tilink img {
                        width: 15%;
                    }
                `);
        // 打开自定义菜单
    }
    function createCheckbox(labelText, todoFun) {
        var checkboxContainer = document.createElement('div');
        var floatingWindowCheckbox = document.createElement('input');
        floatingWindowCheckbox.classList.add('floating-window-checkbox');
        floatingWindowCheckbox.type = "checkbox";
        floatingWindowCheckbox.checked = GM_getValue(labelText, false);
        floatingWindowCheckbox.addEventListener('change', function () {
            GM_setValue(labelText, floatingWindowCheckbox.checked);
            todoFun && todoFun();
        });
        checkboxContainer.appendChild(floatingWindowCheckbox);
        var label = document.createElement('label');
        // label.htmlFor = labelText;
        label.textContent = labelText.split('-')[1];
        checkboxContainer.appendChild(label);
        return checkboxContainer;
    }

    // 打开自定义菜单
    function openCustomMenu() {
        // 创建菜单容器
        var windowContainer = document.createElement('div');
        windowContainer.id = 'floating-window';

        var titleBar = document.createElement('div');
        titleBar.classList.add('title-bar');

        var titleBarButtons = document.createElement('div');
        titleBarButtons.classList.add('title-bar-buttons');

        var maximizeButton = document.createElement('button');
        maximizeButton.classList.add('maximize-button');
        titleBarButtons.appendChild(maximizeButton);

        var minimizeButton = document.createElement('button');
        minimizeButton.classList.add('minimize-button');
        titleBarButtons.appendChild(minimizeButton);

        var closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        titleBarButtons.appendChild(closeButton);

        titleBar.appendChild(titleBarButtons);

        var titleBarText = document.createElement('div');
        titleBarText.textContent = "BiliBili界面设置";
        titleBarText.classList.add('title-bar-text');
        titleBar.appendChild(titleBarText);

        windowContainer.appendChild(titleBar);

        var floatingWindowContent = document.createElement('div');
        floatingWindowContent.classList.add('floating-window-content');

        var floatingWindowInputP = document.createElement('p');
        floatingWindowInputP.textContent = "顶部显示(勾选显示):";
        floatingWindowContent.appendChild(floatingWindowInputP);
        var divVideoPart = document.createElement('div');
        divVideoPart.classList.add('div-checkbox');
        for (const textContent of headerMenuLinks) {
            var accountCheckbox = createCheckbox('header-' + textContent);
            divVideoPart.appendChild(accountCheckbox);
        }
        floatingWindowContent.appendChild(divVideoPart);
        var floatingWindowInputP2 = document.createElement('p');
        floatingWindowInputP2.textContent = "中部显示(勾选显示):";
        floatingWindowContent.appendChild(floatingWindowInputP2);
        var divVideoPart = document.createElement('div');
        divVideoPart.classList.add('div-checkbox');
        for (const textContent of channelParts) {
            var accountCheckbox = createCheckbox('channel-' + textContent);
            divVideoPart.appendChild(accountCheckbox);
        }
        floatingWindowContent.appendChild(divVideoPart);

        var floatingWindowCheckboxP = document.createElement('p');
        floatingWindowCheckboxP.textContent = "视频分区显示(勾选显示):";
        floatingWindowContent.appendChild(floatingWindowCheckboxP);

        var divVideoPart = document.createElement('div');
        divVideoPart.classList.add('div-checkbox');
        for (const textContent of videoElevators) {
            var accountCheckbox = createCheckbox('elevator-' + textContent);
            divVideoPart.appendChild(accountCheckbox);
        }

        floatingWindowContent.appendChild(divVideoPart);
        var floatingWindowCheckboxP2 = document.createElement('p');
        floatingWindowCheckboxP2.textContent = "其他设置(勾选显示，广告也是勾选显示):";
        floatingWindowContent.appendChild(floatingWindowCheckboxP2);

        var divVideoPart = document.createElement('div');
        divVideoPart.classList.add('div-checkbox');
        for (const textContent of adtexts) {
            var accountCheckbox = createCheckbox('other-' + textContent);
            divVideoPart.appendChild(accountCheckbox);
        }

        floatingWindowContent.appendChild(divVideoPart);

        var floatingWindowInputP2 = document.createElement('p');
        floatingWindowInputP2.textContent = "视频设置(勾选生效):";
        floatingWindowContent.appendChild(floatingWindowInputP2);

        var divVideoPart = document.createElement('div');

        divVideoPart.classList.add('div-checkbox');
        for (const textContent of videoset) {
            var accountCheckbox = createCheckbox('video-' + textContent);
            divVideoPart.appendChild(accountCheckbox);
        }
        floatingWindowContent.appendChild(divVideoPart);

        // 创建页脚
        var footer = document.createElement('div');
        footer.style = "text-align: center;font-size: 1em;";
        footer.innerHTML = 'Powered by <a href="https://github.com/GangChengHuang">PeterG</a>';
        floatingWindowContent.appendChild(footer);

        windowContainer.appendChild(floatingWindowContent);

        // 添加窗口容器到页面
        document.body.appendChild(windowContainer);
        initFloatingWindowFunction();
    }
    function initFloatingWindowFunction() {
        // 获取窗口元素
        var floatingWindow = document.getElementById('floating-window');

        // 添加拖动功能
        var isDragging = false;
        var offsetX = 0;
        var offsetY = 0;

        function handleMouseDown(event) {
            isDragging = true;
            offsetX = event.clientX - floatingWindow.offsetLeft;
            offsetY = event.clientY - floatingWindow.offsetTop;
        }

        function handleMouseUp() {
            isDragging = false;
        }

        function handleMouseMove(event) {
            if (isDragging) {
                floatingWindow.style.left = event.clientX - offsetX + 'px';
                floatingWindow.style.top = event.clientY - offsetY + 'px';
            }
        }

        floatingWindow.querySelector('.title-bar').addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        // 添加调整大小功能
        var isResizing = false;
        var originalWidth = floatingWindow.offsetWidth;
        var originalHeight = floatingWindow.offsetHeight;
        var resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';

        function handleResizeMouseDown(event) {
            isResizing = true;
            originalWidth = floatingWindow.offsetWidth;
            originalHeight = floatingWindow.offsetHeight;
            offsetX = event.clientX;
            offsetY = event.clientY;
        }

        function handleResizeMouseUp() {
            isResizing = false;
        }

        function handleResizeMouseMove(event) {
            if (isResizing) {
                var width = originalWidth + (event.clientX - offsetX);
                var height = originalHeight + (event.clientY - offsetY);
                floatingWindow.style.width = width + 'px';
                floatingWindow.style.height = height + 'px';
            }
        }

        resizeHandle.addEventListener('mousedown', handleResizeMouseDown);
        window.addEventListener('mouseup', handleResizeMouseUp);
        window.addEventListener('mousemove', handleResizeMouseMove);
        floatingWindow.appendChild(resizeHandle);

        // 添加最小化和关闭功能
        var minimizeButton = floatingWindow.querySelector('.minimize-button');
        var maximizeButton = floatingWindow.querySelector('.maximize-button');
        var closeButton = floatingWindow.querySelector('.close-button');

        function handleMinimizeClick() {
            floatingWindow.style.display = 'none';
            //showMinimizedIcon();
        }

        function handleMaximizeClick() {
            floatingWindow.classList.toggle('maximized');
        }

        function handleCloseClick() {
            floatingWindow.remove();
            removeMinimizedIcon();
        }

        minimizeButton.addEventListener('click', handleMinimizeClick);
        maximizeButton.addEventListener('click', handleMaximizeClick);
        closeButton.addEventListener('click', handleCloseClick);
    }

    function addMinimizeIcon() {
        // 添加最小化图标
        var minimizedIcon = document.createElement('div');
        minimizedIcon.id = 'minimized-icon';
        minimizedIcon.title = '打开悬浮窗';
        minimizedIcon.textContent = '⚙️';
        minimizedIcon.addEventListener('click', handleMinimizedIconClick);

        function showMinimizedIcon() {
            var minimizedIcons = document.querySelectorAll("#minimized-icon");
            if (minimizedIcons.length > 1) {
                for (var i = 1; i < minimizedIcons.length; i++) {
                    minimizedIcons[i].remove();
                }
            } else if (minimizedIcons.length < 1) {
                document.body.appendChild(minimizedIcon);
            }
        }

        function removeMinimizedIcon() {
            if (document.body.contains(minimizedIcon))
                minimizedIcon.remove();
            //minimizedIcon.remove();
        }
        function handleMinimizedIconClick() {
            var floatingWindows = document.querySelectorAll("#floating-window");
            for (var i = 1; i < floatingWindows.length; i++) {
                floatingWindows[i].remove();
            }
            var floatingWindow = document.getElementById('floating-window');
            if (!floatingWindow) {
                openCustomMenu();
                floatingWindow = document.getElementById('floating-window');
            }
            try {
                if (floatingWindow.style.display == 'block') {
                    floatingWindow.style.display = 'none';
                } else {
                    floatingWindow.style.display = 'block';
                }
            } catch (error) {

            }
            //removeMinimizedIcon();
        }
        showMinimizedIcon();
    }
})();
