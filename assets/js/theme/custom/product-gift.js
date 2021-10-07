import PageManager from '../page-manager';
import $ from 'jquery';

export default class CustomProductGift extends PageManager {
    constructor (context) {
        super(context);
    }

    onReady() {
        var giftOptionID = null;
        this.context.ModifierOptions.forEach(item => {
             if(item.display_name === 'Add a gift option') {
                giftOptionID = '#attribute_text_'+item.id;
             }
        });
        /* Event listener input Congratulatory inscription */
        document.querySelector(giftOptionID).addEventListener('input', this.validate);

        /* Event listener input */
        /* show input for a gift */
        document.querySelector('#yesCheck').addEventListener('change', function(){
            document.getElementById('ifYes').style.display = 'block';
        });
        /* none input for a gift */
        document.querySelector('#none').addEventListener('change',function(){
            document.getElementById('ifYes').style.display = 'none';
        });
        /**/
        /* Event listener input */
        /* Send a congratulation inscription via email */
        document.querySelector('#emailID').addEventListener('change', function () {
            document.getElementById('congratulationInscriptionIfYes').style.display = 'block';
        });

        /* Event listener input */
        /* Print it on a gift card */
        document.querySelector('#gift').addEventListener('change', function() {
            document.getElementById('congratulationInscriptionIfYes').style.display = 'none';
        });

        var textInput = document.querySelector(giftOptionID);
        var emailInput = document.querySelector("#emailInput");
        var btn = document.querySelector("#form-action-addToCart");

        btn.addEventListener("click", function() {
            if (document.getElementById('gift').checked === true) {
                document.querySelector(giftOptionID).value += "\n" + " Print it on a gift card ";
            }
            if (document.getElementById('emailID').checked === true) {
                document.querySelector(giftOptionID).value += "\n" + " Send a congratulation inscription via email: " + emailInput.value;
            }
        });
    }

    /*input validation function */
    validate(e) {
        const regex = /[A-Za-z ,.]/;
        const chars = e.target.value.split('');
        const char = chars.pop();
        if (!regex.test(char)) {
            e.target.value = chars.join('');
            alert('unknown or restricted symbol');
        }
        if(chars.length > 199 ){
            alert('too much symbols. Please, make your text shorter');
        }
    }
}