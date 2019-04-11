import { Observable, Subject, BehaviorSubject } from './node_modules/rxjs';

export class MultiStateService {

  constructor() { 
  }

  public createSubscription<T>(subscriptionName: string) : Observable<T> {
    let publicPropName = this.getPublicPropName(subscriptionName);
    let privatePropName = this.getPrivatePropName(subscriptionName);

    let dataSubjectName = this.getDataSubjectName(subscriptionName);

    if (!this[dataSubjectName]) {
        let data = this[privatePropName] || null;
        this[dataSubjectName] = new BehaviorSubject<T>(data);
    }

    this[publicPropName] = this[dataSubjectName].asObservable();

    return this[publicPropName];
  }

  public setData<T>(subscriptionName: string, newData: T) : void {
    let privatePropName = this.getPrivatePropName(subscriptionName);
    let dataSubjectName = this.getDataSubjectName(subscriptionName);
    
    this[privatePropName] = newData;
    if(this[dataSubjectName]) {
      this[dataSubjectName].next(newData);
    }
  }

  public getData<T>(subscriptionName: string) : T {
    let propName = this.getPrivatePropName(subscriptionName);
    return this[propName];
  }

  private getPublicPropName(subscriptionName: string) : string {
    return `${subscriptionName}$`;
  }
  
  private getPrivatePropName(subscriptionName: string) : string {
    return `_${subscriptionName}`;
  }

  private getDataSubjectName(subscriptionName: string) : string {
    return `dataSubject${subscriptionName}`;
  }
}
