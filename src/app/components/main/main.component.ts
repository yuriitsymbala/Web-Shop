import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { CartSideComponent } from "../cart-side/cart-side.component";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { ProductComponent } from "../product/product.component";
import { SortComponent } from "../sort/sort.component";
import { Observable, take } from "rxjs";
import { Product } from "../../models/Product";
import { Sort } from "../../models/Sort";
import { ProductService } from "../../services/product.service";

@Component({
    selector: "main",
    standalone: true,
    imports: [ HeaderComponent, FooterComponent, SortComponent, ProductComponent, CartSideComponent, CommonModule ],
    templateUrl: "./main.component.html",
    styleUrl: "./main.component.scss",
})
export class MainComponent {
  products$!: Observable<Product[]>;
  sorts: Sort[] = this.getSorts();
  selectedIndex: number = 0;
  isCartOpened: boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
      this.fetchProducts();
      this.observeProducts();
  }

  onProductClick(product: Product) {
      this.isCartOpened = true;
      this.productService.addCartItem(product);
  }

  onSortClick(sort: Sort): void {
      this.selectedIndex = sort.id;

      switch (sort.id) {
          case 0:
              this.products$ = this.productService.sortedByFeatured$;
              break;
          case 1:
              this.products$ = this.productService.sortedByPrice$;
              break;
          case 2:
              this.products$ = this.productService.sortedByDate$;
              break;
          case 3:
              this.products$ = this.productService.sortedByCategory$;
              break;
          default:
              break;
      }
  }

  onCartClose() {
      this.isCartOpened = false;
  }

  private fetchProducts(): void {
      this.productService.fetchProducts().pipe(take(1)).subscribe();
  }

  private observeProducts(): void {
      this.products$ = this.productService.products$;
  }

  private getSorts(): Sort[] {
      return [
          new Sort(0, "Featured"),
          new Sort(1, "Price"),
          new Sort(2, "Date"),
          new Sort(3, "Category"),
      ];
  }
}
