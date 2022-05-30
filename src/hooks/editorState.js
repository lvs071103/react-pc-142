import React from "react"
import { Editor, EditorState } from "draft-js"
import "draft-js/dist/Draft.css"

export default function RichEditor () {
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  )

  const editor = React.useRef(null)
  function focusEditor () {
    editor.current.focus()
  }

  return (
    <div
      style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
      onClick={focusEditor}
    >
      <Editor
        ref={editor}
        editorState={editorState}
        onChange={setEditorState}
        placeholder="Write something!"
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
      />
    </div>
  )
}