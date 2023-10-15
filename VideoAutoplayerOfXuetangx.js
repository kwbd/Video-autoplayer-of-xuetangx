// ==UserScript==
// @name         学堂在线自动播放脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  播放完成学堂在线的视频后，自动切换至下一视频。
// @author       kwbd
// @match        https://www.xuetangx.com/learn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xuetangx.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';
    var playButton
    var observer
    let timer = null;
    console.log('scrip start!');
    
    function diffTime(timeStr){
        var [time1, time2] = timeStr.split(" / ");
        const [h1, m1, s1] = time1.split(':').map(Number);
        const [h2, m2, s2] = time2.split(':').map(Number);

        const seconds1 = h1 * 3600 + m1 * 60 + s1;
        const seconds2 = h2 * 3600 + m2 * 60 + s2;

        const diff = seconds2 - seconds1;
        console.log('diff = ' + diff);
        return diff;
    }

    function cheakVideo(){
        playButton = document.querySelector('.xt_video_player_big_play_layer');
        if(playButton === null){
            var nextButton = document.querySelector('.next');
            nextButton.click();
            console.log('BplayButton === null');
        }
        else{
            observer.observe(playButton, { attributes: true });
            console.log('BplayButton != null');
        }
    }

    function setObserver(){
        console.log('Start!');
        playButton = document.querySelector('.xt_video_player_big_play_layer');

        // 监听class变化
        observer = new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    // class发生变化时执行的代码
                    console.log('Button class has changed!');
                    if(playButton.classList.contains('pause_show')){
                        console.log('pause_show');
                        var Timestamp = document.querySelector('.xt_video_player_current_time_display').textContent;
                        if(diffTime(Timestamp) < 5){
                            var nextButton = document.querySelector('.next');
                            nextButton.click();
                        }
                    }
                    else{
                        console.log('no pause_show');
                    }
                }
            }
        });
        observer.observe(playButton, { attributes: true });
        window.addEventListener('pushState', function(e) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
                console.log('Double event!');
                setTimeout(cheakVideo, 2000);
            } else {
                timer = setTimeout(function() {
                    timer = null;
                    console.log('Single event!');
                }, 250);
            }
        });
    }

    setTimeout(setObserver, 5000);
    
})();
