window.addEventListener('DOMContentLoaded', () => {

    const tables = document.querySelectorAll('.tabcontent');
    const links = document.querySelectorAll(".tabheader__item");
    const linksParent = document.querySelector('.tabheader__items');
    const modal_btns = document.querySelectorAll('[data-modal]');
    const modal_btn_close = document.querySelector('[data-close]');
    const modal = document.querySelector('.modal');
    const doc = document.documentElement;
    const menuCont = document.querySelector('.menu__field .container');

    hideAllTables();
    showTable(3);
    // const modalTimeout = setTimeout(openModal, 2000);









    linksParent.addEventListener('click', event => {

        event.preventDefault();


        let target = event.target;


        if (target && target.classList.contains("tabheader__item")) {

            links.forEach((item, index) => {


                if (item == target) {
                    target.classList.add('tabheader__item_active');
                    hideAllTables();
                    showTable(index);
                } else {
                    item.classList.remove('tabheader__item_active');
                }
            });






        }




    });

    modal_btns.forEach(item => {
        console.log(modal_btns);
        item.addEventListener('click', openModal);

    });

    modal.addEventListener('click', event => {
        if (event.target === modal || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.documentElement.addEventListener('keydown', event => {
        if (event.code === 'Escape') {
            closeModal();
        }
    });

    window.addEventListener('scroll', event => {
        event.preventDefault();
        // const target = event.target;

        if (window.pageYOffset + doc.clientHeight == (document.scrollHeight)) {
            openModal();
        }

    });



    class MenuItem {
        constructor(title, desc, pic, alt, price, parentSelector, ...classes) {
            this.title = title;
            this.desc = desc;
            this.pic = pic;
            this.alt = alt;
            this.price = price;
            this.transfer = 27;
            this.parentSelector = document.querySelector(parentSelector);
            this.classes = classes;
            this.changeToUAH();
        }


        changeToUAH() { this.price = this.price * this.transfer; }

        render() {

            const newItemEl = document.createElement('div');

            if (this.classes.length === 0) {
                console.log('nulll!');
                this.classes = ['menu__item'];

            }

            this.classes.forEach(className => {

                newItemEl.classList.add(className);

            });

            newItemEl.innerHTML = ` 
            
                <img src="${this.pic}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">Меню "${this.title}"</h3>
                <div class="menu__item-descr">${this.desc}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>               
                </div>`;

            this.parentSelector.append(newItemEl);
        }


    }


    new MenuItem(
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        'img/tabs/vegy.jpg',
        'vegy',
        7,
        '.menu__field .container',
    )
        .render();


    new MenuItem(
        'Меню "Премиум"',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        'img/tabs/elite.jpg',
        'elite',
        18,
        '.menu__field .container',
        'menu__item')
        .render();

    new MenuItem(
        'Меню "Постное',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        'img/tabs/post.jpg',
        'post',
        2,
        '.menu__field .container',
        'menu__item')
        .render();



    // Forms

    const message = {
        loading: 'img/spinner.svg',
        success: 'Success',
        failure: 'Fail, motherfucker',
    };


    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('click', postData(form));
    });



    function postData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('submit!');       


            const statusMessage = document.createElement('img');                       
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
            `;

            form.append(statusMessage);

            const req = new XMLHttpRequest();
            req.open('POST', 'server.php');
            req.setRequestHeader('content-type', 'application/json');
            const formData = new FormData(form);

            const obj = {};

            formData.forEach((value, key) => {
                obj[value] = key;
            });

            req.send(JSON.stringify(obj));

            req.addEventListener('load', () => {
                if (req.status === 200) {
                    console.log(req.response);
                    showThanksModal(message.success);

                } else {
                    showThanksModal(message.failure);
                }

                form.reset();
                statusMessage.remove();


            });



        });
    }

    function showThanksModal(message) {
        const previosModalDialog = document.querySelector('.modal__dialog');
        previosModalDialog.classList.add('hide');

        if (!modal.classList.contains('show')) { openModal(); }

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div div class="modal__content" >
            <div data-close class='modal__close'>×</div>
                    <div class='modal__title'>${message}</div>
                    </div>`;

        modal.append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            previosModalDialog.classList.remove('hide');
            // previosModalDialog.classList.add('show');
            closeModal();
        }, 4000);
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openModal() {

        modal.classList.toggle('show');
        // document.body.style.overflow = 'hidden';
        // clearTimeout(modalTimeout);

    }

    function hideAllTables() {
        tables.forEach(table => {
            table.classList.remove('show');
            table.classList.add('hide');
        });
    }

    function showTable(index = 0) {
        tables[index].classList.remove('hide');
        tables[index].classList.add('show');
    }

});