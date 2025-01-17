import { ElementRef, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { KeyboardClassKey } from '../../enums/keyboard-class-key.enum';
import { IKeyboardDeadkeys } from '../../interfaces/keyboard-deadkeys.interface';
import { IKeyboardIcons } from '../../interfaces/keyboard-icons.interface';
export declare const VALUE_NEWLINE = "\n\r";
export declare const VALUE_SPACE = " ";
export declare const VALUE_TAB = "\t";
export declare class MatKeyboardKeyComponent implements OnInit {
    private _deadkeys;
    private _icons;
    private _deadkeyKeys;
    private _iconKeys;
    active$: BehaviorSubject<boolean>;
    pressed$: BehaviorSubject<boolean>;
    key: string | KeyboardClassKey;
    active: boolean;
    pressed: boolean;
    input?: ElementRef;
    control?: FormControl;
    genericClick: EventEmitter<MouseEvent>;
    enterClick: EventEmitter<MouseEvent>;
    bkspClick: EventEmitter<MouseEvent>;
    capsClick: EventEmitter<MouseEvent>;
    altClick: EventEmitter<MouseEvent>;
    shiftClick: EventEmitter<MouseEvent>;
    spaceClick: EventEmitter<MouseEvent>;
    tabClick: EventEmitter<MouseEvent>;
    keyClick: EventEmitter<MouseEvent>;
    readonly lowerKey: string;
    readonly charCode: number;
    readonly isClassKey: boolean;
    readonly isDeadKey: boolean;
    readonly hasIcon: boolean;
    readonly icon: string;
    readonly cssClass: string;
    inputValue: string;
    constructor(_deadkeys: IKeyboardDeadkeys, _icons: IKeyboardIcons);
    ngOnInit(): void;
    onClick(event: MouseEvent): void;
    private deleteSelectedText;
    private replaceSelectedText;
    private _triggerKeyEvent;
    private _getCursorPosition;
    private _getSelectionLength;
    private _setCursorPosition;
    private _isTextarea;
}
