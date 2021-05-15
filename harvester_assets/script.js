// Ramndom function
function rand(min, max) { return Math.trunc(Math.random() * (max-min+1)) + min; }

// Globals
var _APPLES = [
    { ready: 0, left: 25, top: 45, size: rand(40,80)/10, show: 1, rot: rand(-40,40), time: rand(3,15), collected: 0 },
    { ready: 0, left: 17, top: 28, size: rand(40,80)/10, show: 1, rot: rand(-40,40), time: rand(3,15), collected: 0 },
    { ready: 0, left: 30, top:  8, size: rand(40,80)/10, show: 1, rot: rand(-40,40), time: rand(3,15), collected: 0 },
    { ready: 0, left: 40, top: 22, size: rand(40,80)/10, show: 1, rot: rand(-40,40), time: rand(3,15), collected: 0 },
    { ready: 0, left: 59, top: 14, size: rand(40,80)/10, show: 1, rot: rand(-40,40), time: rand(3,15), collected: 0 },
    { ready: 0, left: 58, top: 53, size: rand(40,80)/10, show: 1, rot: rand(-40,40), time: rand(3,15), collected: 0 },
    { ready: 0, left: 75, top: 40, size: rand(40,80)/10, show: 1, rot: rand(-40,40), time: rand(3,15), collected: 0 }
];
var STATISTICS = {
    kg: 0,
    type_0: 0,
    type_1: 0,
    type_2: 0
};
var ACTION = false, TARGET, W0, COLLECTED = 0;
const DRAG_APPLE = document.querySelector('.harvester_drag_apple');

// Vue
var app = new Vue({
el: '#harvester__tree',
data: {
    apples: _APPLES,
    game: true,
    win: false,
},
methods: {
    MouseDown(apple)
    {
        if (apple.ready && this.game)
        {
            ACTION = true;
            TARGET = apple;
            DRAG_APPLE.style.transform = 'rotate(' + TARGET.rot + 'deg)';
            DRAG_APPLE.style.width = TARGET.size +'vh';
            W0 = window.innerHeight * TARGET.size / 100;
        }
        else
        {
            this.game = false;
            this.win = false;
        }
    }
},
mounted() {
    document.addEventListener('mousemove', e =>
    {
        if (ACTION)
        {
            DRAG_APPLE.style.left = (e.pageX-W0/2) + 'px';
            DRAG_APPLE.style.top = (e.pageY-W0/2) + 'px';
            DRAG_APPLE.style.display = 'block';
            TARGET.show = 0;
        }
    });
    document.addEventListener('mouseup', e =>
    {
        if (ACTION)
        {
            if (e.target == document.querySelector('.harvester_basket_drop'))
            {
                // Drop apple
                document.querySelector('.harvester_basket_container').innerHTML += '<img class="harvester_drag_apple" src="harvester_assets/images/apple-1.png" style="transform: rotate(' + TARGET.rot + 'deg); display: block; width: ' + TARGET.size + 'vh; left: ' + (e.offsetX-W0/2) + 'px; top:' + (e.offsetY-W0/2) + 'px; z-index:8;">'

                // Add statistics
                if (TARGET.size < 6)
                {
                    STATISTICS.kg += 1;
                    STATISTICS.type_0++;
                    document.querySelectorAll('.harvester__left_collect_type')[0].innerText = STATISTICS.type_0;
                }
                else if (TARGET.size < 7.5)
                {
                    STATISTICS.kg += 2;
                    STATISTICS.type_1++;
                    document.querySelectorAll('.harvester__left_collect_type')[1].innerText = STATISTICS.type_1;
                }
                else
                {
                    STATISTICS.kg += 3;
                    STATISTICS.type_2++;
                    document.querySelectorAll('.harvester__left_collect_type')[2].innerText = STATISTICS.type_2;
                }
                document.querySelector('.harvester_bar_text').innerText = STATISTICS.kg + ' КГ';
                document.querySelector('.harvester_bar_round').style.strokeDasharray = Math.round(46 * 2 * Math.PI / 21 * STATISTICS.kg) + ' 9999';

                // Win check
                COLLECTED++;
                if (COLLECTED == this.apples.length)
                {
                    this.game = false;
                    this.win = true;
                }
            }
            else 
            {
                TARGET.show = 0;
                this.game = false;
                this.win = false;
            }
        }
        ACTION = false;
        DRAG_APPLE.style.display = 'none';
    });

    const LOOP = setInterval(() =>
    {
        if (!this.game) clearInterval(LOOP);

        for (const apple of this.apples)
        {
            // Growing
            if (!apple.ready)
            {
                apple.time--;
                if (apple.time < 0) apple.ready = 1;
            }

            // Timer after grow
            if (apple.ready && apple.show)
            {
                apple.time++;
                if (apple.time > 3)
                {
                    this.game = false;
                    this.win = false;
                    ACTION = false;
                    DRAG_APPLE.style.display = 'none';
                }
            }
        }
    }, 1000);
},
})