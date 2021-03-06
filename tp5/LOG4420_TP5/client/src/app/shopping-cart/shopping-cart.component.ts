import { Component, OnInit } from '@angular/core';
import { ApiServiceComponent } from 'app/api-service/api-service';
import * as _ from "lodash";

/**
 * Defines the component responsible to manage the shopping cart page.
 */
@Component({
  selector: 'shopping-cart',
  templateUrl: './shopping-cart.component.html'
})
export class ShoppingCartComponent implements OnInit {
  // TODO: À compléter
  private scFromServer : any[] = [];
  private products : any[] = [];
  private sc : any[] = [];
  private total = 0;
  constructor(private apiService : ApiServiceComponent){
  }
  ngOnInit(){
    this.updateWholeSc();
  }

  removeItem(item){
    item.quantity--;
    this.apiService.putDataWithPromiseShoppingCart({productId:item.product.id, quantity:item.quantity});
    this.updateTotal();
  }
  addItem(item){
    item.quantity++;
    this.apiService.putDataWithPromiseShoppingCart({productId:item.product.id, quantity:item.quantity});
    this.updateTotal();
  }
  clearRow(item){
    var confirmBox = confirm("Voulez-vous supprimer le produit du panier ?");
    if (confirmBox == true) {
      let idx = this.sc.indexOf(item);
      if(idx !== -1){
        this.sc.splice(idx,1);
      }
      this.apiService.deleteDataWithPromiseShoppingCart(item.product.id);
      this.updateTotal();
    }
 
  }
  emptySC(){
    var confirmBox = confirm("Voulez-vous supprimer tous les produits du panier ?");
    if (confirmBox == true) {
      this.sc = [];
      this.apiService.deleteAllDataWithPromiseShoppingCart();
      this.updateTotal();
    }
  }
  updateTotal(){
    this.total = 0;
    this.updateWholeSc();

  }
  updateWholeSc(){
    this.apiService.getDataWithPromiseShoppingCart().then(sc => {
      this.scFromServer = sc;
      if(this.scFromServer && this.scFromServer.length > 0){
        this.apiService.getDataWithPromiseProducts().then(products => {
          this.products = products;
        
          this.scFromServer.forEach(item => {
            let foundProduct = null;
            if(foundProduct = _.find(this.products, (prod) =>{
              return prod.id === item.productId;
            })){
              let total = item.quantity * foundProduct.price;      
              let itemInSc = this.sc.find(item=>{
                return item.product.id === foundProduct.id;
              })
              if(!itemInSc){
                this.sc.push({product:foundProduct, quantity : item.quantity, total : total})
              }
              
            }
          })
          this.sc.forEach(item => {
            item.total = item.quantity * item.product.price;
            this.total += (item.total);
          })
        })
      }
    })
  }
}
