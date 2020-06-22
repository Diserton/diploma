import {Injectable} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {Observable} from "rxjs"
import {Message, Position} from "../interfaces"

@Injectable({
  providedIn: 'root'
})
export class PositionsService {
  constructor(private http: HttpClient) {
  }

  fetch(id: string): Observable<Position[]> {
    return  this.http.get<Position[]>(`/api/position/category/${id}`)
  }

  get(id: string): Observable<Position> {
    return  this.http.get<Position>(`/api/position/${id}`)
  }

  create(position: Position): Observable<Position> {
    return this.http.post<Position>('/api/position', position)
  }

  update(position: Position): Observable<Position> {
    return this.http.patch<Position>(`/api/position/${position._id}`, position)
  }

  delete(position: Position): Observable<Message> {
    return this.http.delete<Message>(`/api/position/${position._id}`)
  }
}
