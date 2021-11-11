import PageManager from '../page-manager';
import $ from 'jquery';
import nod from "nod-validate";

export default class CustomProductEngraving extends PageManager {
    constructor (context) {
        super(context);
        this.EngravingLengthID= null;
        this.$EngravingLengthSelect = $('[id*="attribute_select"]');
        this.$EngravingLengthSelectLabel = $('[for*="attribute_select"]');
        this.EngravingID = null;
        this.productInputTextValueLength = null;
        this.productInputTextValue = '';
        this.$productInput = $('[id*="attribute_text"]')[0];
        this.productId = this.context.ModifierProduct.id;
        this.productCount = document.getElementById('qty[]').value;
        this.optionValueID = null;
        this.cartItemsID = '';
        this.lineItems = null;
        this.$form = $('form[data-cart-item-add]');
        this.Nod = nod();
        this.Nod.configure({submit:document.getElementById('form-action-addToCart'), disableSubmit: true});
    }
    onReady() {
        $('#none').prop('checked', true);
        $('#inputAddEngraving').hide();
        /**/
        this.context.ModifierOptions.forEach(item => {
            if(item.display_name === this.context.Engravinglength) {
                this.EngravingLengthID = item.id;
                this.$EngravingLengthSelect.hide();
                this.$EngravingLengthSelectLabel.hide();
                this.optionValueID = item.values[0].id;

                this.$productInput.addEventListener('input', function(e) {
                    const $productInputText = $('[id*="attribute_text"]');
                    this.productInputTextValueLength = $productInputText.find('value').prevObject[0].value.replace(/ +/g, '').trim().length;
                    item.values.forEach(i =>{
                        if(this.productInputTextValueLength == i.data) {
                            i.selected = true;
                            this.optionValueID = i.id;
                        }
                    });
                }.bind(this));
            }

            //Find an object whose name 'Engraving'
            if(item.display_name === this.context.Engraving) {
                this.EngravingID = item.id;
                document.querySelector('[id*="attribute_text"]').addEventListener('input', function(e) {
                    const $productInputText = $('[id*="attribute_text"]');

                    let productInputTextValueLength = $productInputText.find('value').prevObject[0].value.replace(/ +/g, '').trim().length;
                    this.productInputTextValue = $productInputText.find('value').prevObject[0].value;

                    let EngravingLengthID = this.EngravingLengthID;
                    $(`#attribute_select_${this.EngravingLengthID} > option`).each(function() { //Run through the loop of each option
                    if(this.text.indexOf(productInputTextValueLength)>=0) { //Find if the string present as substring
                        $(`#attribute_select_${EngravingLengthID} > option`).removeAttr("selected"); //Remove the existing selected option
                        $(this).attr("selected","selected"); //Select this matching option as selected
                            return false; //Return after first match is found
                        }
                    });
                }.bind(this));
            }
        });

        /* Event listener input */
        /* show input for a engraving */
        document.querySelector('#addEngraving').addEventListener('change', function(){
            $('#inputAddEngraving').show();
            $(this.$productInput)[0].setAttribute("required", "");
        }.bind(this));

        /**
        * Event listener input
        * onChange
        */
        document.querySelector('#inputAddEngraving').addEventListener('input', this.onChange.bind(this));

        /* Event listener input */
        /* hide input for a engraving */
        document.querySelector('#none').addEventListener('change', function(){
            $('#inputAddEngraving').hide();
            $(this.$productInput)[0].removeAttribute("required", "");
            $('[id*="attribute_text"]')[0].value = '';
        }.bind(this));

        this.getCart(`/api/storefront/carts`);
            /*Add event Listener*/
            document.querySelector('#form-action-addToCart').addEventListener('click', function(e){
                if(this.productInputTextValueLength==null && document.querySelector('#addEngraving').checked) {
                    return
                }
                e.preventDefault();
                this.getOptionsProduct();
                if (this.Nod.getStatus([this.$productInput]) == 'invalid') {
                    e.preventDefault();
                } else {
                    this.createCartItems(`/api/storefront/carts/${this.cartItemsID ? `${this.cartItemsID}/item` : ''}`,{
                    "lineItems": [{
                         "quantity": this.productCount,
                         "productId": this.productId,
                         "optionSelections": [
                             {"optionId": this.EngravingLengthID, "optionValue": this.optionValueID},
                             {"optionId": this.EngravingID, "optionValue": `${this.productInputTextValue}`}
                         ]
                     }]
                    })
                    .then(()=> {window.location = '/cart.php'})
                }
            }.bind(this));
    }

    /**
     * Get option product
     */
    getOptionsProduct(){
        let optionsString = "";
        let optionProduct = this.$form.serialize()
            .split("&")
            .filter((str)=>{return str.includes("attribute")})
            .map((i)=>{return i.replace('attribute%5B', '').replaceAll('%20', ' ').split('%5D=')})

        optionProduct.forEach(element => {
            if (optionsString.length == 0) {
                optionsString = `{"option_id": ${element[0]}, "optionValue": "${element[1]}"}`
            } else {
                optionsString = optionsString + ", " + `{"option_id": ${element[0]}, "optionValue": "${element[1]}"}`;
            }
        })
        this.optionsString = optionsString;
        this.createLineItem();
    }

    /**
     * Create Line cart a Cart
     */
    createLineItem () {
        let itemQuantity = document.getElementById('qty[]').value;
        this.lineItems = `{"lineItems":[{
                    "productId": ${this.productId}, 
                    "quantity": ${itemQuantity}, 
                    "option_selections": [ 
                        ${this.optionsString}
                    ]}
                ]}`;
    }
    /**
    * Returns a Cart
    */
    getCart(url) {
        return fetch(url, {
            method: "GET",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(cart => {
            this.cartItemsID = cart[0]?.id
            })
        .catch(error => console.error(error));
    }
    /**
    * Creates a Cart
    */
    createCartItems(url, cartItems) {
        return fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cartItems),
        })
        .then(response => response.json());
    };

    /**
    * Event listener input
    * Validation
    */
    onChange(e) {
        const $input = $(e.target);
        this.Nod.add([{
            // Raw dom element
            selector: $input,
            // Custom function. Notice that a call back is used. This means it should
            // work just fine with ajax requests (is user name already in use?).
            validate: "max-length:50",
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
        this.Nod.performCheck();
    }

}
