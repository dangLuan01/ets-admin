import { ClassicEditor, Essentials, Paragraph, Bold, Italic, Underline, Strikethrough, 
  Code, Heading, List, Indent, BlockQuote, Link, Table, TableToolbar, Undo, Font, 
  FontBackgroundColor, FontColor, FontSize, Superscript, Subscript
} from 'ckeditor5';

export const CkEditor = ClassicEditor;

export const CkEditorConfig = {
  licenseKey: 'GPL',

  plugins: [ Essentials, Paragraph, Bold, Italic, Underline, Strikethrough, Code, Heading, 
    List, Indent, BlockQuote, Link, Table, TableToolbar, Undo, Font, FontColor, FontBackgroundColor, 
    FontSize, Superscript, Subscript
  ],

  toolbar: {
    items: [
      'undo', 'redo',
      '|',
      'heading',
      '|',
      'fontColor',
      'fontBackgroundColor',
      'fontSize',
      '|',
      'superscript',
      'subscript',
      '|',
      'bold', 'italic', 'underline', 'strikethrough', 'code',
      '|',
      'link',
      '|',
      'bulletedList', 'numberedList',
      'outdent', 'indent',
      '|',
      'blockQuote',
      '|',
      'insertTable',
    ],
    shouldNotGroupWhenFull: true
  },
  fontColor: {
      colors: [
      { color: '#000000', label: 'Black' },
      { color: '#FF0000', label: 'Red' },
      { color: '#00FF00', label: 'Green' },
      { color: '#0000FF', label: 'Blue' }
    ]
  }
};
