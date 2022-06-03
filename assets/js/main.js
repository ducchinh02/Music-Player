let w = window.innerWidth;

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playlist = $('.playlist')
const dashboard = $('.dashboard')

// if (w <= 991) {
//     playlist.setAttribute('style', `margin-top: ${dashboard.offsetHeight}px!important`)
// }
// window.addEventListener('resize', () => {
//     let w = window.innerWidth;
//     if (w <= 991) {
//         playlist.setAttribute('style', `margin-top: ${dashboard.offsetHeight}px!important`)
//     } else {
//         playlist.setAttribute('style', `margin-top: 3rem!important`)
//     }
// })

const toggleMode = $('.dashboard .toggle-mode')


toggleMode.addEventListener('click', () => {
    toggleMode.classList.toggle('active')
    document.body.classList.toggle('dark-mode')
})

const cdThumb = $('.dashboard .cd .cd-thumb img')
const cdName = $('.dashboard .cd-details .cd-name')
const cdArtist = $('.dashboard .cd-details .cd-artist')
const audio = $('#audio')
const playMusic = $('.btn-play')
const progress = $('#progress')
const next = $('.btn-next')
const previous = $('.btn-previous')
const repeat = $('.btn-repeat')
const random = $('.btn-shuffle')



const appMusic = {
    currentIndex: 0,
    randomPlaying: false,
    songs: [{
            name: 'Có Chắc Yêu Là Đây',
            artist: 'Sơn Tùng M-TP',
            thumb: 'assets/img/ccyld.webp',
            audio: 'assets/audio/ccyld.mp3'

        }, {
            name: 'Crooked',
            artist: 'G-Dragon',
            thumb: 'assets/img/photo-1-16517486994471428285152.webp',
            audio: 'assets/audio/Crooked-GDRAGON-6292063.mp3'

        },

        {
            name: 'Bồ Em',
            artist: 'dính',
            thumb: 'assets/img/boem.webp',
            audio: 'assets/audio/Bồ Em.mp3'

        },
        {
            name: 'Tình Yêu Xanh Lá (Slowed)',
            artist: 'juju',
            thumb: 'assets/img/tyxl.webp',
            audio: 'assets/audio/Tình yêu xanh lá - Thịnh Suy (slowed ver).mp3'

        },
        {
            name: 'Internet Love',
            artist: 'hnhngan ft. Tyronee',
            thumb: 'assets/img/internetlove.webp',
            audio: 'assets/audio/hnhngan  Internet Love ft Tyronee  Official.mp3'

        },
    ],
    render: function() {
        const htmls = this.songs.map(song => {
            return ` 
            <div class="song trans_3 d-flex align-items-center">
            <!-- thumb -->
            <div class="thumb">
                <img src="${song.thumb}">
            </div>
            <div class="song-details flex-grow-1 font-weight-bold">
                <div class="song-name">${song.name} </div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <!-- options -->
            <div class="options">
                <ion-icon name="ellipsis-vertical"></ion-icon>
            </div>
        </div>`
        })
        $('.playlist-item').innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        // cd ui
        const cd = $('.cd')
        const cdWidth = cd.offsetWidth
        let w = window.innerWidth;
        document.onscroll = () => {
                const scrollTop = window.screenY || document.documentElement.scrollTop
                const newCdWidth = cdWidth - scrollTop
                    // cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
                cd.style.opacity = newCdWidth / cdWidth
            }
            // play - pause
        playMusic.addEventListener('click', () => {
            if (!playMusic.classList.contains('playing')) {
                audio.play()
                playMusic.classList.add('playing')

            } else {
                audio.pause()
                playMusic.classList.remove('playing')
            }
        })
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }
        audio.addEventListener('ended', () => {
            if (this.randomPlaying) {
                this.random()
            } else {
                this.next()
            }
            this.playMusicFunction()

        })
        progress.onchange = function(e) {
            const seektime = audio.duration / 100 * e.target.value
            audio.currentTime = seektime
        }
        next.addEventListener('click', () => {
            if (this.randomPlaying) {
                this.random()
            } else {
                this.next()
            }
            this.playMusicFunction()
        })
        previous.addEventListener('click', () => {
            if (this.randomPlaying) {
                this.random()
            } else {
                this.previous()
            }
            this.playMusicFunction()
        })

        repeat.addEventListener('click', () => {
            if (!repeat.classList.contains('loop')) {
                repeat.classList.add('loop')
                audio.loop = true
            } else {
                repeat.classList.remove('loop')
                audio.loop = false
            }
        })

        random.addEventListener('click', () => {
            this.randomPlaying = !this.randomPlaying
            if (!random.classList.contains('active')) {
                random.classList.add('active')
                this.random()
            } else {
                random.classList.remove('active')
            }


        })

        const MusicItem = $$('.playlist-item .song')
        MusicItem.forEach((song, index) => {
            song.addEventListener('click', () => {
                MusicItem.forEach((song, index) => {
                    song.classList.remove('playing')
                })
                this.currentIndex = index;
                this.playMusicFunction()
                playMusic.classList.add('playing')
                song.classList.add('playing')
                audio.play()
            })
        })
    },
    random: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.playMusicFunction()
        audio.play()
        playMusic.classList.add('playing')
    },
    next: function() {
        this.currentIndex++;
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0
        }
    },
    previous: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
    },
    playMusicFunction: function() {
        this.loadCurrentSong()
        if (playMusic.classList.contains('playing')) {
            audio.play()
        }
        this.checkPlaying()

    },
    checkPlaying: function() {
        const MusicItem = $$('.playlist-item .song')
        MusicItem.forEach((song, index) => {
            if (this.currentIndex == index) {
                MusicItem.forEach((song, index) => {
                    song.classList.remove('playing')
                })
                MusicItem[this.currentIndex].classList.add('playing')
            }
        })
    },
    loadCurrentSong: function() {
        this.checkPlaying()
        cdThumb.src = this.currentSong.thumb
        cdName.textContent = this.currentSong.name
        cdArtist.textContent = this.currentSong.artist
        audio.src = this.currentSong.audio
    },
    start: function() {
        // hien thi danh sach bai hat
        this.render()
            // dinh nghia thuoc tinh
        this.defineProperties()
            // xu ly su kien 
        this.handleEvents()
            // chay bai hat dau tien
        this.loadCurrentSong()
    },
}
appMusic.start()