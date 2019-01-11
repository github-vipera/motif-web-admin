import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {

     /** Determines if this route (and its subtree) should be detached to be reused later */
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
      console.log(">>>>>>> shouldDetach ", route);
      return true;
    }

  /** Stores the detached route */
  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {}

  /** Determines if this route (and its subtree) should be reattached */
  shouldAttach(route: ActivatedRouteSnapshot): boolean { 
    console.log(">>>>>>> shouldAttach ", route);
    return false; }

  /** Retrieves the previously stored route */
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle { 
    console.log(">>>>>>> retrieve ", route);
    return null; }

  /** Determines if a route should be reused */
  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean { 
    console.log(">>>>>>> shouldReuseRoute ", future, curr);
    return future.routeConfig === curr.routeConfig; }

}

