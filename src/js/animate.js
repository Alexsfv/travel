(function(){

    class AnimatedBlock {
        constructor(el) {
            this.$el = el;
            this.getIndexClass();
        }

        show() {
            const classAnimate = this.$el.classList[this.indexAnimateClass];
            const activeClass = classAnimate + '_active';
            this.clearOpacity();
            this.$el.classList.remove(classAnimate);
            this.$el.classList.add(activeClass);
        }

        clearOpacity() {
            this.$el.style.opacity = '';
        }

        getIndexClass() {
            const classList = this.$el.classList;
            classList.forEach((className, index) => {
                const isAnimateClass = className.indexOf('animate_') !== -1
                if (isAnimateClass) {
                    this.indexAnimateClass = index;
                }
            });
        }
    }

    const blocks = document.querySelectorAll('[class*="animate_"]');  

    let coolDown = false;
    let coord = {};
    let blocksObj = [];

    addOpacity(blocks);

    window.addEventListener('load', () => {
        updateCoord();
        blocksObj = createBlocks(blocks);
        refreshStateBlocks(blocksObj);
        window.addEventListener('scroll', showAnimateByScroll);
    });

    window.addEventListener('resize', () => {
        updateCoord();
        refreshStateBlocks(blocksObj);
    });
    
    function addOpacity(elements, value = 0) {
        elements.forEach((el) => {
            el.style.opacity = value;
        });
    };

    function createBlocks(blocks) {
        let result = [];
        blocks.forEach((block) => {
            const blockObject = new AnimatedBlock(block);
            if (!isScrolled(block)) {
                result.push(blockObject);
            } else {
                blockObject.clearOpacity();
            }
        });
        return result;
    }    
    
    function deleteShowAnimateByScroll() {
        window.removeEventListener('scroll', showAnimateByScroll);
    }

    function refreshStateBlocks(blocks) {
        const notVibibleBlocks = []
        blocks.forEach((block, index, arr) => {
            if (isVisible(block.$el)) {
                block.show();
            } else {
                notVibibleBlocks.push(block);
            }
        });
        blocksObj = notVibibleBlocks;

        if (blocksObj.length === 0) {
            deleteShowAnimateByScroll();
        }
    }
    
    function showAnimateByScroll() {
        updateCoord();
        if (!coolDown) {
            refreshStateBlocks(blocksObj);
            coolDown = true;
            setTimeout(() => {
                coolDown = false;
                refreshStateBlocks(blocksObj);
            }, 0);
        }
    };

    function updateCoord() {
        coord = {
            scrollY: window.scrollY,
            vh: window.innerHeight,
            screenBottom: this.scrollY + this.vh,
        };
    }

    function getPositionBottom(el) {
        const offsetBottomY = el.getBoundingClientRect().bottom;
        return +(offsetBottomY + coord.scrollY).toFixed(2);
    }

    function isScrolled(el) {
        return (coord.scrollY > getPositionBottom(el)) ?
            true : false;
    }

    function isVisible(el) {
        const offsetTopY = el.getBoundingClientRect().top;
        const offsetBottomY = el.getBoundingClientRect().bottom;
        return (coord.vh < offsetTopY || offsetBottomY < 0)?
            false : true;            
    }
})();