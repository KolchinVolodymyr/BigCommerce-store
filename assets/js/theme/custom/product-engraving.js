import PageManager from '../page-manager';
import $ from 'jquery';

export default class CustomProductEngraving extends PageManager {
    constructor (context) {
        super(context);
        this.EngravingLengthID= null;
        this.$EngravingLengthSelect = $('[id*="attribute_select"]');
        this.$EngravingLengthSelectLabel = $('[for*="attribute_select"]')
        this.EngravingID = null;
        this.productInputTextValueLength = null;
        this.productInputTextValue = '';
        this.$productInput = $('[id*="attribute_text"]')[0];
        this.productId = this.context.ModifierProduct.id;
        this.productCount = document.getElementById('qty[]').value;
        this.optionValueID = null;//?? нужно определить 1-й ID который === (Length = 0)
        this.cartItemsID = '';
        this.inputAddEngraving = document.getElementById('inputAddEngraving');
    }
    onReady() {
        $('#none').prop('checked', true);
        $('#inputAddEngraving').hide();
        /**/
        this.context.ModifierOptions.forEach(item => {
            if(item.display_name === 'Engraving length') {
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
            if(item.display_name === 'Engraving') {
                //Listener input
                this.EngravingID = item.id;
                document.querySelector('[id*="attribute_text"]').addEventListener('input', function(e) {
                    const $productInputText = $('[id*="attribute_text"]');

                    let productInputTextValueLength = $productInputText.find('value').prevObject[0].value.replace(/ +/g, '').trim().length;
                    this.productInputTextValue = $productInputText.find('value').prevObject[0].value;

                    let EngravingLengthID = this.EngravingLengthID;//???
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

        /* Event listener input */
        /* hide input for a engraving */
        document.querySelector('#none').addEventListener('change', function(){
            $('#inputAddEngraving').hide();
            $(this.$productInput)[0].removeAttribute("required", "");
            $('[id*="attribute_text"]')[0].value = ''; //value input = null
        }.bind(this));

        this.getCart(`/api/storefront/carts`);

            /*Add event Listener*/
            document.querySelector('#form-action-addToCart').addEventListener('click', function(e){
                console.log('this', this);
                console.log('this.cartItemsID', this.cartItemsID);
                e.preventDefault();
                    if(this.cartItemsID) {
                        console.log("this", this);
                        console.log('this.optionValueID updateCart', this.optionValueID);
                        createCartItems(`/api/storefront/carts/${this.cartItemsID}/items`, {
                            "lineItems": [
                                {
                                    "quantity": this.productCount,
                                    "productId": this.productId,
                                    "optionSelections": [
                                        {"optionId": this.EngravingLengthID, "optionValue": this.optionValueID},
                                        {"optionId": this.EngravingID, "optionValue": `${this.productInputTextValue}`}
                                    ]
                                }
                            ]
                        })
                        .then((data)=> {
                            console.log('data', data);
                             console.log('updateCart');
                            //window.location = '/cart.php'
                            })
                        .catch(error => console.error(error));

                    } else {
                        console.log('createCartItems');
                        console.log("this", this);
                        console.log('this.optionValueID createCart', this.optionValueID);
                        createCartItems(`/api/storefront/carts`, {
                            "lineItems": [
                                {
                                    "quantity": this.productCount,
                                    "productId": this.productId,
                                    "optionSelections": [
                                        {"optionId": this.EngravingLengthID, "optionValue": this.optionValueID},
                                        {"optionId": this.EngravingID, "optionValue": `${this.productInputTextValue}`}
                                    ]
                                }
                            ]
                        })
                        .then(()=> {
                                console.log('createCartItems');
                                //window.location = '/cart.php'
                            })
                        .catch(error => console.error(error));
                    }

            }.bind(this));

            function createCartItems(url, cartItems) {
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


    }

    /*function show input for a engraving  */
//    yesnoCheck() {
//        if (document.getElementById('addEngraving').checked) {
//            document.getElementById('inputAddEngraving').style.display = 'block';
//        }
//        else document.getElementById('inputAddEngraving').style.display = 'none';
//    }

    /**/
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


}
