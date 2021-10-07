import PageManager from '../page-manager';
import $ from 'jquery';

export default class CustomProductEngraving extends PageManager {

    onReady() {
        var EngravingLengthID = null;
        var EngravingID = null;
        var productInputTextValueLength = null;
        var productInputTextValue = null;
        var productId = this.context.ModifierProduct.id;
        var productCount = document.getElementById('qty[]').value;
        var optionValueID = null;
        var cartItemsID = null;

            this.context.ModifierOptions.forEach(item => {
                //find an object whose name 'Engraving length'
                //assign ID to our global variable EngravingLengthID
                if(item.display_name === 'Engraving length') {
                    EngravingLengthID = item.id;
                    document.querySelector('[id*="attribute_select"]').style.display = 'none';  //display:none
                    document.querySelector('[for*="attribute_select"]').style.display = 'none'; //display:none

                    document.querySelector('[id*="attribute_text"]').addEventListener('input', function(e) {
                        const $productInputText = $('[id*="attribute_text"]');
                        productInputTextValueLength = $productInputText.find('value').prevObject[0].value.replace(/ +/g, '').trim().length;
                        item.values.forEach(i =>{
                            if(productInputTextValueLength == i.data) {
                                i.selected = true;
                                optionValueID = i.id;
                            }
                        });
                    });
                }

                //Find an object whose name 'Engraving'
                if(item.display_name === 'Engraving') {
                    //Listener input
                    EngravingID = item.id;
                    document.querySelector('[id*="attribute_text"]').addEventListener('input', function(e) {
                        const $productInputText = $('[id*="attribute_text"]');

                        /* Validation start */
                        const regex = /[A-Za-z ,.]/;
                        const chars = e.target.value.split('');
                        const char = chars.pop();
                        if (!regex.test(char)) {
                             e.target.value = chars.join('');
                             alert('unknown or restricted symbol');
                        }
                        if(chars.length > 50 ){
                             alert('too much symbols. Please, make your text shorter');
                        }
                        productInputTextValueLength = $productInputText.find('value').prevObject[0].value.replace(/ +/g, '').trim().length;
                        productInputTextValue = $productInputText.find('value').prevObject[0].value;

                        $(`#attribute_select_${EngravingLengthID} > option`).each(function() { //Run through the loop of each option
                            if(this.text.indexOf(productInputTextValueLength)>=0) { //Find if the string present as substring
                               $(`#attribute_select_${EngravingLengthID} > option`).removeAttr("selected"); //Remove the existing selected option
                               $(this).attr("selected","selected"); //Select this matching option as selected
                               return false; //Return after first match is found
                            }
                        });
                    });
                }
            });

            /*function show input for a engraving  */
            function yesnoCheck() {
                if (document.getElementById('yesCheck').checked) {
                    document.getElementById('ifYes').style.display = 'block';
                }
                else document.getElementById('ifYes').style.display = 'none';
            }
             /* Event listener input */
             /* show input for a engraving */
             document.querySelector('#yesCheck').addEventListener('change', function(){
                yesnoCheck(); //

                document.querySelector('[id*="attribute_text"]').addEventListener('input', function() {
                    document.getElementById('form-action-addToCart').setAttribute("disabled", "disabled");
                });

             });

            document.querySelector('#none').addEventListener('change', yesnoCheck);

            let resGetCart = getCart(`/api/storefront/carts`);

            /*Add event Listener*/
            document.querySelector('#form-action-addToCart').addEventListener('click', function(e){
                e.preventDefault();
                    if(cartItemsID) {
                        createCartItems(`/api/storefront/carts/${cartItemsID}/items`, {
                            "lineItems": [
                                {
                                    "quantity": productCount,
                                    "productId": productId,
                                    "optionSelections": [
                                        {"optionId": EngravingLengthID, "optionValue": optionValueID},
                                        {"optionId": EngravingID, "optionValue": `${productInputTextValue}`}
                                    ]
                                }
                            ]
                        })
                        .then(()=> window.location = '/cart.php')
                        .catch(error => console.error(error));

                    } else {
                        createCartItems(`/api/storefront/carts`, {
                            "lineItems": [
                                {
                                    "quantity": productCount,
                                    "productId": productId,
                                    "optionSelections": [
                                        {"optionId": EngravingLengthID, "optionValue": optionValueID},
                                        {"optionId": EngravingID, "optionValue": `${productInputTextValue}`}
                                    ]
                                }
                            ]
                        })
                        .then(()=> window.location = '/cart.php')
                        .catch(error => console.error(error));
                    }

            });

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

            function getCart(url) {
                 return fetch(url, {
                    method: "GET",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(cart => { cartItemsID = cart[0]?.id })
                .catch(error => console.error(error));
            }

    }

}
