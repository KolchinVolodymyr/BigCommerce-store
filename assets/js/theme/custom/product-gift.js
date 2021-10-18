import PageManager from '../page-manager';
import nod from "nod-validate";

export default class CustomProductGift extends PageManager {
    constructor (context) {
        super(context);
        this.giftOptionID = null;
        this.showInputGift = $('#showInputGiftOption')[0];
        this.noneInputGift = $('#none')[0];
        this.sendCongratulationEmail = $('#emailID')[0];
        this.printGiftCard = $('#gift')[0];
        this.$addToCartBtn = $('#form-action-addToCart');
        this.$addToCartBtn.on('click', () => this.AddToCartButton());
        this.OptionsID = null;
        this.emailInput = $('#emailInput')[0];
        this.printOnGiftCard = $('[for=gift]').text().trim();
        this.SendCongratulationInscriptionEmail =$('[for=emailID]').text().trim();
    }

    onReady() {
        this.context.ModifierOptions.forEach(item => {
             if(item.display_name === this.context.optionGiftTextField) {
                this.giftOptionID = '#attribute_text_'+item.id;
             }
        });
        this.context.ModifierOptions.forEach(item => {
            if(item.display_name === this.context.optionDeliveryMessage) {
                this.OptionsID = '#attribute_text_'+item.id;
                $(`[for*=attribute_text_${item.id}]`).hide();
            }
            $(`${this.OptionsID}`).hide();
        });

        /**
         *  Event listener input
         *  Congratulatory inscription
         */
        document.querySelector(this.giftOptionID).addEventListener('input', this.onChangeGift.bind(this));

        /**
         *  Event listener input
         *  show input for a gift
         */
        this.showInputGift.addEventListener('change', function(){
            $('#inputGift').show();
            $(this.giftOptionID)[0].setAttribute("required", "");
            $(this.printGiftCard)[0].setAttribute("checked", "");
        }.bind(this));

        /**
         *  Event listener input
         *  None input for a gift
         */
        this.noneInputGift.addEventListener('change',function(){
            $('#inputGift').hide();
            $(this.giftOptionID)[0].removeAttribute("required", "");
        }.bind(this));

        /**
         * Event listener input
         * Send a congratulation inscription via email
         */
        this.sendCongratulationEmail.addEventListener('change', function () {
            $('#formInputEmail').show();
            this.emailInput.setAttribute("required", "");
        }.bind(this));

        /**
         * Event listener input
         * Print it on a gift card
         */
        this.printGiftCard.addEventListener('change', function() {
            this.emailInput.removeAttribute("required", "");
            $('#formInputEmail').hide();
        }.bind(this));

        /**
         * Event listener input
         * Validation Email input
         */
        this.emailInput.addEventListener('input', this.onChangeEmail.bind(this));

    }

    /**
     * *
     * @constructor
     */
    AddToCartButton (){
        if (document.getElementById('gift').checked === true) {
            document.querySelector(this.OptionsID).value = this.printOnGiftCard;
        }
        if (document.getElementById('emailID').checked === true) {
            document.querySelector(this.OptionsID).value = this.SendCongratulationInscriptionEmail + " " + this.emailInput.value;
        }
    }

    /**
     * *
     * @param e
     */
    onChangeGift(e) {
        const $input = $(e.target);
        nod().add([{
            // Raw dom element
            selector: $input,
            // Custom function. Notice that a call back is used. This means it should
            // work just fine with ajax requests (is user name already in use?).
            validate: "max-length:200",
            errorMessage: this.context.tooMuchSymbols
        },
        {
            selector:  $input,
            validate: function (callback, value){
                if (value.match(/^[a-zA-Z_ ]*$/)) {
                    callback(true);
                } else {
                    callback(false);

                }
            },
            errorMessage: this.context.unknowRestrictedSymbol
        }]);
    };

    onChangeEmail(e) {
        let emailNod = nod();
        const $input = $(e.target);
        emailNod.add([{
            // Raw dom element
            selector: $input,
            //"email" (Uses the RFC822 spec to check validity)
            validate: "email",
            errorMessage: this.context.useValidEmail
        }]);
    }
}