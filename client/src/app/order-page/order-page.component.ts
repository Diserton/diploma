import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {NavigationEnd, Router} from "@angular/router"
import {MaterialInstance, MaterialService} from "../shared/classes/material.service"
import {OrderService} from "./order.service"
import {Order, OrderPosition, Position} from "../shared/interfaces"
import {OrdersService} from "../shared/services/orders.service"
import {Subscription} from "rxjs"
import {PositionsService} from "../shared/services/positions.service"

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef
  modal: MaterialInstance
  oSub: Subscription
  isRoot: boolean
  pending = false

  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersService,
              private positionsService: PositionsService) {
  }

  ngOnInit() {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  ngOnDestroy() {
    this.modal.destroy()
    if (this.oSub) {
      this.oSub.unsubscribe()
    }
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  removePosition(orderPosition: OrderPosition) {
    this.order.remove(orderPosition)
  }

  open() {
    this.modal.open()
  }

  cancel() {
    this.modal.close()
  }

  submit() {
    this.pending = true

    this.modal.close()

    const order: Order = {
      list: this.order.list.map(item => {
        //delete item._id
        return item
      })
    }




      this.oSub = this.ordersService.create(order).subscribe(
        newOrder => {
          this.updateBalance(order)
          MaterialService.toast(`Заказ №${newOrder.order} был добавлен`)
          this.order.clear()
        },
        error => MaterialService.toast(error.error.message),
        () => {
          this.modal.close()
          this.pending = false
        }
      )

  }

  private updateBalance(order: Order) {

    order.list.forEach(item=>{
      this.positionsService.get(item._id).subscribe(pos => {
        const newPosition: Position = {
          name: pos.name,
          cost: pos.cost,
          category: pos.category,
          quantity: pos.quantity - item.quantity,
          _id: pos._id
        }
        this.positionsService.update(newPosition).subscribe(pos=>{
          console.log(`Успех. Остаток: ${pos.name} - ${pos.quantity} `)
          },
          () => {
          console.log('Ошибка')
        })
      })
    })
  }
}
