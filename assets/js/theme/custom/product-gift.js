import PageManager from '../page-manager';
import $ from 'jquery';

export default class CustomProductGift extends PageManager {
     constructor (context) {
        super(context);
     }

     onReady() {
        console.log('Hello world!!!');
     }

}