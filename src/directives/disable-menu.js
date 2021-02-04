export default {
    beforeMount (el) {
        el.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
};
