import PageManager from '../page-manager';


export default class CustomBrands extends PageManager {
    constructor(context) {
        super(context);
    }



    onReady() {
        //console.log("$('.brandGrid')", $('.brandGrid'));
        $('.brandGrid').hide();

        const divs = document.querySelectorAll('.subMenu-item');
        divs.forEach(el => el.addEventListener('click', e => {
            event.preventDefault();
            //console.log('sdsdsdsddsdsd');
            //window.location.href = 'sssss'
            console.log('Window.location.href/', window.location.href);

            console.log('e.target.getAttribute', e.target.getAttribute('href').replace('#', ''));
        }));

//        console.log('http://window.location.href/', window.location.href);
//        console.log('CustomBrands',CustomBrands);
//        console.log('this', this);
    }
}