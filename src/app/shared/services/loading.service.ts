import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private loadingCount = 0;
    loading = signal(false);

    show() {
        this.loadingCount++;
        this.loading.set(true);
    }

    hide() {
        this.loadingCount--;
        if (this.loadingCount <= 0) {
            this.loadingCount = 0;
            this.loading.set(false);
        }
    }
}
