<template>
    <div class="space-y-2">
        <label
            id="listbox-label"
        >
            Option type
        </label>
        <div class="mt-1 relative">
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded="true"
                aria-labelledby="listbox-label"
                class="text-white relative w-full bg-darkinput border border-gray-300 rounded-md shadow-sm pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-discord sm:text-sm"
                @click="opened = !opened"
            >
                <span class="flex items-center">
                    <span class="ml-3 block truncate">
                        {{ selectedOptionName }}
                    </span>
                </span>
                <span class="ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                        class="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </span>
            </button>

            <div
                class="absolute mt-1 w-full rounded-md bg-darktwo shadow-lg"
                :class="opened ? 'opacity-100' : 'opacity-0 pointer-events-none'"
            >
                <ul
                    tabindex="-1"
                    role="listbox"
                    aria-labelledby="listbox-label"
                    aria-activedescendant="listbox-item-3"
                    class="max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                >
                    <li
                        v-for="option in options"
                        id="listbox-item-0"
                        :key="option"
                        role="option"
                        class="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-darkone"
                        @click="selected = option; opened = false;"
                    >
                        <div class="flex items-center">
                            <span
                                class="ml-3 block font-normal truncate"
                                :class="selectedOptionName === option ? 'font-semibold' : 'font-normal'"
                            >
                                {{ option }}
                            </span>
                        </div>
                        <span
                            v-if="selectedOptionName === option"
                            class="absolute inset-y-0 right-0 flex items-center pr-4"
                        >
                            <svg
                                class="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SelectForm',
    props: {
        default: {
            type: String,
            required: true
        },
        options: {
            type: Array,
            required: true
        }
    },
    data () {
        return {
            opened: false,
            selected: null
        };
    },
    computed: {
        selectedOptionName () {
            return this.selected || this.default;
        }
    }
};
</script>
