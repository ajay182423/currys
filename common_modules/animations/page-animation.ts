import { style, animate, trigger, transition, keyframes } from '@angular/animations';

export const slideDown = trigger('slideDown', [
    transition("* => *", [
        animate('.2s ease', keyframes([
            style({ opacity: 0, transform: 'translateY(-10%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
        ]))
    ])
]);

export const slideUp = trigger('slideUp', [
    transition("* => *", [
        animate('.2s ease', keyframes([
            style({ opacity: 0, transform: 'translateY(3%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
        ]))
    ])
]);

export const slideLeft = trigger('slideLeft', [
    transition(":enter", [
        animate('.2s ease', keyframes([
            style({ opacity: 0, transform: 'translateX(3%)', offset: 0 }),
            style({ opacity: 1, transform: 'translateX(0)', offset: 1.0 }),
        ]))
    ]),
    transition(":leave", [
        animate('0s ease', keyframes([
            style({ opacity: 1, transform: 'translateX(0%)', offset: 0 }),
            style({ opacity: 0, transform: 'translateX(-3%)', offset: 1.0 }),
        ]))
    ])
]);