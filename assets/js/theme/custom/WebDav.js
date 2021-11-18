import PageManager from '../page-manager';
import $ from 'jquery';

export default class CustomDemoWebDaw extends PageManager {
  constructor(context) {
    super(context);
    this.productSku = $('.productView-info-value[data-product-sku]')[0].childNodes[0].data;
  }
  /**
   *
   */
  renderWebDav() {
    if ($('#webDavContent').length > 0) {
      $('#webDavContent').load(`/content/product-information/${this.productSku}.html`, function( response, status, xhr){
        if ( status == "error" ) {
          $('#titleWebDav').hide();
          $('#webDavID').hide();
        } else {
          $('#titleWebDav').show();
        }
      });
    }
  }
  onReady () {
    this.renderWebDav();
  }
}