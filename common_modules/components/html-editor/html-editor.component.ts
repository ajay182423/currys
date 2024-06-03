import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IJsonFormOptions } from 'common_modules/interfaces/json-form';
import { ConfirmDialogService } from 'common_modules/services/confirm-dialog.service';
import { InputDialogService } from 'common_modules/services/input-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'projects/xbot/src/environments/environment';

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
})
export class HtmlEditorComponent implements OnInit, AfterViewInit {

  @Input() editorClass?: string;
  @ViewChild('editor') editor: ElementRef;
  buttonList: any = [
    { id: 'bold', icon: 'format_bold', name: 'Bold' },
    { id: 'italic', icon: 'format_italic', name: 'Italic' },
    { id: 'underline', icon: 'format_underlined', name: 'Underline' },
    { id: 'title', icon: 'title', name: 'Title' },
    { id: 'paragraph', icon: 'segment', name: 'Paragraph' },
    { id: 'bullets', icon: 'format_list_bulleted', name: 'Bullets' },
    { id: 'numbering', icon: 'format_list_numbered', name: 'Numbering' },
    { id: 'hyperlink', icon: 'add_link', name: 'Hyperlink' },
    { id: 'table', icon: 'table', name: 'Table' },
    { id: 'image', icon: 'image', name: 'Image' },
    { id: 'video', icon: 'smart_display', name: 'Video' },
    { id: 'impNote', icon: 'error', name: 'Important note' },
    { id: 'clearAll', icon: 'delete_forever', name: 'Clear all' }
  ];

  constructor(
    private renderer: Renderer2,
    private confirmDialogService: ConfirmDialogService,
    private inputDialogService: InputDialogService,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const editorContent = localStorage.getItem(environment.localStorageHelpDocEditor);
    if (editorContent) {
      this.editor.nativeElement.innerHTML = editorContent;
    }
  }

  editorButtonClick(btnId: string) {
    switch (btnId) {
      case 'bold':
        this.formatSelectedText(btnId);
        break;
      case 'italic':
        this.formatSelectedText(btnId);
        break;
      case 'underline':
        this.formatSelectedText(btnId);
        break;
      case 'title':
        this.insertSubTitle();
        break;
      case 'paragraph':
        this.insertParagraph();
        break;
      case 'bullets':
        this.insertUnorderedList();
        break;
      case 'numbering':
        this.insertOrderedList();
        break;
      case 'hyperlink':
        this.insertHyperlink();
        break;
      case 'table':
        this.insertTable();
        break;
      case 'image':
        this.insertImage();
        break;
      case 'video':
        this.insertVideo();
        break;
      case 'impNote':
        this.insertImportantNote();
        break;
      case 'clearAll':
        this.clearAll();
        break;
      default:
        this.toastrService.info('Incorrect button selection');
        break;
    }
  }

  formatSelectedText(formatType: string) {
    if (window.getSelection().toString().length < 1) {
      this.toastrService.info('Please select text first');
      return;
    }
    const range = window.getSelection().getRangeAt(0);
    const textParent = range.commonAncestorContainer.parentElement;
    const tag = textParent.tagName.toLowerCase();
    let element, text;
    //formatType = bold or italic or underline
    if (tag === 'span') {
      if (textParent.classList.contains(formatType)){
        textParent.classList.remove(formatType);
      } else {
        textParent.classList.add(formatType);
      }
    } else {
      element = document.createElement('span');
      element.classList.add(formatType);
    }
    if (element !== undefined) {
      range.surroundContents(element);
    } else if (textParent.classList.length === 0)  {
      text = document.createTextNode(textParent.textContent)
      const mainParent = textParent.parentElement;
      mainParent.insertBefore(text, textParent);
      mainParent.removeChild(textParent);
      mainParent.normalize();
    }
    this.removeWindowSelection();
    this.setEditorLocalStorage();
  }

  insertHyperlink() {
    if (window.getSelection().toString().length < 1) {
      this.toastrService.info('Please select text first');
      return;
    }
    const range = window.getSelection().getRangeAt(0);
    const textParent = range.commonAncestorContainer.parentElement;
    if (textParent.tagName.toLowerCase() === 'a') {
      let text = document.createTextNode(textParent.textContent)
      const mainParent = textParent.parentElement;
      mainParent.insertBefore(text, textParent);
      mainParent.removeChild(textParent);
      mainParent.normalize();
    } else {
      const hyperLinkForm: IJsonFormOptions = {
        formHeading: 'Insert Hyperlink',
        primaryAction: 'Insert',
        formControls: [
          { name: 'hyperlink', label: 'Url', value: '', type: 'text', disabled: false, validators: { required: true } }
        ]
      };
      Promise.resolve().then(async () => {
        const formData = await this.inputDialogService.openInputDialog(hyperLinkForm);
        if (formData) {
          if (formData?.hyperlink?.length === 0) {
            this.toastrService.info('Hyperlink url is required');
            return;
          }
          const a = this.renderer.createElement('a');
          this.renderer.setAttribute(a, 'href', formData?.hyperlink);
          this.renderer.setAttribute(a, 'target', '_blank');
          range.surroundContents(a);
          this.setEditorLocalStorage();
        }
      }).catch((error) => {
        console.warn("Error while inserting hyperlink!");
        console.error(error);
      });
    }
  }

  insertImage() {
    let imageForm: IJsonFormOptions = {
      formHeading: 'Insert Image',
      primaryAction: 'Insert',
      formControls: [
        { name: 'imageName', label: 'Name', value: '', type: 'text', disabled: false, validators: { required: true } },
        { name: 'imageUrl', label: 'Link', value: '', type: 'text', disabled: false, validators: { required: true } }
      ]
    };
    Promise.resolve().then(async () => {
      const formData = await this.inputDialogService.openInputDialog(imageForm);
      if (formData) {
        if (formData?.imageUrl?.length === 0 || formData?.imageName?.length === 0) {
          this.toastrService.info('Image link and name are required');
          return;
        }
        const img = this.renderer.createElement('img');
        this.renderer.setAttribute(img, 'alt', formData?.imageName);
        this.renderer.setAttribute(img, 'src', formData?.imageUrl);
        this.renderer.appendChild(this.editor.nativeElement, img);
        this.setEditorLocalStorage();
      }
    }).catch((error) => {
      console.warn("Error while inserting image!");
      console.error(error);
    });
  }

  insertVideo() {
    let videoForm: IJsonFormOptions = {
      formHeading: 'Insert Video',
      primaryAction: 'Insert',
      formControls: [
        { name: 'videoUrl', label: 'Link', value: '', type: 'text', disabled: false, validators: { required: true } }
      ]
    };
    Promise.resolve().then(async () => {
      const formData = await this.inputDialogService.openInputDialog(videoForm);
      if (formData) {
        if (formData?.videoUrl?.length === 0) {
          this.toastrService.info('Video link is required');
          return;
        }
        const video = this.renderer.createElement('video');
        const source = this.renderer.createElement('source');
        this.renderer.setAttribute(video, 'controls', '');
        this.renderer.setAttribute(source, 'src', formData?.videoUrl);
        this.renderer.setAttribute(source, 'type', 'video/mp4');
        this.renderer.appendChild(video, source);
        this.renderer.appendChild(this.editor.nativeElement, video);
        this.setEditorLocalStorage();
      }
    }).catch((error) => {
      console.warn("Error while inserting video!");
      console.error(error);
    });
  }

  insertTable() {
    let tableForm: any = {
      formHeading: 'Insert Table',
      primaryAction: 'Insert',
      formControls: [
        { name: 'rows', label: 'Rows', value: '3', type: 'text', disabled: false, validators: { required: true, min: 1, max: 50 } },
        { name: 'columns', label: 'Columns', value: '3', type: 'text', disabled: false, validators: { required: true, min: 1, max: 10 } },
      ]
    };
    Promise.resolve().then(async () => {
      const formData = await this.inputDialogService.openInputDialog(tableForm);
      if (formData) {
        if (formData?.rows < 1 || formData?.columns < 1) {
          this.toastrService.info('Rows or Columns value cannot be less than 1');
          return;
        }
        //table
        const table = this.renderer.createElement('table');
        //header
        const headerTr = this.renderer.createElement('tr');
        for (let j = 1; j <= formData?.columns; j++) {
          const headerTh = this.renderer.createElement('th');
          this.renderer.setProperty(headerTh, 'innerHTML', 'Column ' + j);
          this.renderer.appendChild(headerTr, headerTh);
        }
        this.renderer.appendChild(table, headerTr);
        //rows
        for (let i = 1; i <= formData?.rows; i++) {
          const rowTr = this.renderer.createElement('tr');
          for (let j = 1; j <= formData?.columns; j++) {
            const rowTd = this.renderer.createElement('td');
            this.renderer.setProperty(rowTd, 'innerHTML', '');
            this.renderer.appendChild(rowTr, rowTd);
          }
          this.renderer.appendChild(table, rowTr);
        }
        this.renderer.appendChild(this.editor.nativeElement, table);
        this.setEditorLocalStorage();
      }
    }).catch((error) => {
      console.warn("Error while inserting table!");
      console.error(error);
    });
  }

  insertSubTitle() {
    const h3 = this.renderer.createElement('h3');
    this.renderer.setProperty(h3, 'innerHTML', 'Sub Title');
    this.renderer.appendChild(this.editor.nativeElement, h3);
    this.setEditorLocalStorage();
  }

  insertParagraph() {
    const p = this.renderer.createElement('p');
    this.renderer.setProperty(p, 'innerHTML', 'Add your paragraph text here');
    this.renderer.appendChild(this.editor.nativeElement, p);
    this.setEditorLocalStorage();
  }

  insertUnorderedList() {
    const ul = this.renderer.createElement('ul');
    const li = this.renderer.createElement('li');
    this.renderer.setProperty(li, 'innerHTML', 'List item 1');
    this.renderer.appendChild(ul, li);
    this.renderer.appendChild(this.editor.nativeElement, ul);
    this.setEditorLocalStorage();
  }

  insertOrderedList() {
    const ol = this.renderer.createElement('ol');
    const li = this.renderer.createElement('li');
    this.renderer.setProperty(li, 'innerHTML', 'List item 1');
    this.renderer.appendChild(ol, li);
    this.renderer.appendChild(this.editor.nativeElement, ol);
    this.setEditorLocalStorage();
  }

  insertImportantNote() {
    const h4 = this.renderer.createElement('h4');
    this.renderer.setProperty(h4, 'innerHTML', 'Important Note');
    //note-content
    const content = this.renderer.createElement('div');
    this.renderer.addClass(content, 'note-content');
    this.renderer.setProperty(content, 'innerHTML', 'Add your note text here');
    //Apend header and content to note container
    const container = this.renderer.createElement('div');
    this.renderer.addClass(container, 'imp-note');
    this.renderer.appendChild(container, h4);
    this.renderer.appendChild(container, content);
    //add to editor
    this.renderer.appendChild(this.editor.nativeElement, container);
    this.setEditorLocalStorage();
  }

  removeWindowSelection() {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    }
  }

  setEditorLocalStorage() {
    localStorage.setItem(environment.localStorageHelpDocEditor, this.editor.nativeElement.innerHTML);
  }

  clearAll() {
    if (this.editor.nativeElement.innerHTML === '') {
      this.toastrService.info('Editor is alredy empty');
      return;
    }
    Promise.resolve().then(async () => {
      if (await this.confirmDialogService.openConfirmDialog('Clear Editor', 'Are you sure you want to clear all content?', 'Cancel', 'Clear')) {
        this.editor.nativeElement.innerHTML = '';
        localStorage.removeItem(environment.localStorageHelpDocEditor);
      }
    }).catch((error) => {
      console.warn("Editor cannot be cleared");
      console.error(error);
    });
  }


}
