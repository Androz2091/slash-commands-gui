<template>
    <div
        ref="modal"
        class="modal fixed w-full h-full top-0 left-0 flex items-center justify-center"
        style="backdrop-filter: blur(10px);"
        :class="modalClass"
    >
        <perfect-scrollbar>
            <div
                class="modal-container w-11/12 md:max-w-lg mx-auto rounded-2xl shadow-lg z-50 bg-darkone border-darktwo border-2"
                style="margin: auto;"
            >
                <!-- Add margin if you want to see some of the overlay behind the modal-->
                <div class="modal-content py-4 text-left px-6">
                    <!--Title-->
                    <div class="flex justify-between items-center pb-3">
                        <p class="text-2xl font-bold">
                            {{ title }}
                        </p>
                        <div
                            class="cursor-pointer z-50 opacity-0 md:opacity-100"
                        >
                            <svg
                                class="fill-current text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                @click="close"
                            >
                                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                            </svg>
                        </div>
                    </div>
                    <slot />

                    <slot name="footer" />
                </div>
            </div>
        </perfect-scrollbar>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        title: {
            type: String,
            required: true
        },
        open: {
            type: Boolean,
            required: true
        }
    },
    emits: ['close'],
    computed: {
        modalClass () {
            return !this.open ? 'opacity-0 pointer-events-none' : '';
        }
    },
    watch: {
        open (newValue) {
            if (newValue) document.body.classList.add('modal-active');
            else document.body.classList.remove('modal-active');
        }
    },
    mounted () {
        document.onkeydown = (evt) => {
            if (this.open) {
                evt = evt || window.evt;
                let escape = false;
                if ('key' in evt) {
                    escape = evt.key === 'Escape' || evt.key === 'Esc';
                } else {
                    escape = evt.keyCode === 27;
                }
                if (escape) this.close();
            }
        };
    },
    methods: {
        close () {
            this.$emit('close');
        }
    }
};
</script>

<style>
.modal {
    transition: opacity 0.25s ease;
}
body.modal-active {
    overflow: hidden !important;
}
</style>
