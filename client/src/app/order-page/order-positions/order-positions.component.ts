import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router"
import {PositionsService} from "../../shared/services/positions.service"
import {Observable, of} from "rxjs"
import {Position} from "../../shared/interfaces"
import {map, switchMap} from "rxjs/operators"
import {OrderService} from "../order.service"
import {MaterialService} from "../../shared/classes/material.service"

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>

  constructor(private route: ActivatedRoute,
              private positionsService: PositionsService,
              private order: OrderService) {}

  ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            return this.positionsService.fetch(params['id'])
          }
        ),
        map(
          (positions: Position[]) => {
            return positions.map(position => {
              position.quantity = 1
              return position
            })
          }
        )
      )
  }

  addToOrder(position: Position) {

    this.positionsService.get(position._id).subscribe(currentPosition => {
      if (currentPosition.quantity >= position.quantity) {
        MaterialService.toast(`Добавлено х${position.quantity}`)
        this.order.add(position)
      } else  {
        MaterialService.toast(`Недостаточно товаров на складе`)
      }

    })

  }

}
