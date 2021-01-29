import ReactQuill from 'react-quill'

type Props = {
  onChange: any;
  defaultValue: any;
  error: any
}

// https://github.com/zenoamaro/react-quill/issues/369
// https://codepen.io/DmitrySkripkin/pen/NEEdBe
const modules = {
  keyboard: {
    bindings: {
      'list autofill': {
        prefix: /^\s{0,}(1){1,1}(\.|-|\*|\[ ?\]|\[x\])$/
      }
    }
  }
}

const Component = (props: Props) => {
  const { onChange, defaultValue, error } = props;
  return (
    <>
    <ReactQuill
      className={error ? 'has-error' : ''}
      defaultValue={defaultValue}
      onChange={onChange}
      modules={modules}
    />
    </>);
};

export default Component;