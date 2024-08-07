import { dynamicMenu } from '@/utils/dynamicData'
import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useState } from 'react'

const tiny_api_key = process.env.NEXT_PUBLIC_TINY_KEY
const API_URL = process.env.NEXT_PUBLIC_API_URL

interface MainProps {
  content: string
  onChangeContent: any
  slug: string
}

const ContractEditorForm = ({ content, onChangeContent, slug }: MainProps) => {
  const [loading, setLoading] = useState(true)

  const handleEditorChange = (content: any, editor: any) => {
    onChangeContent(content)

    return false
  }

  useEffect(() => {
    // setTimeout(() => {
    //   setLoading(false)
    // }, 2500)
  }, [])
  return (
    <>
      {loading && <center className="mt-2">Loading..</center>}

      <div style={{ visibility: `${loading ? 'hidden' : 'visible'}` }}>
        <Editor
          apiKey={tiny_api_key}
          // onChange={(e, d) => console.log('changed : ', d)}
          value={content}
          onInit={(e, editor) => {
            setLoading(false)
          }}
          init={{
            height: 650,
            width: '100%',
            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'preview',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'code',
              'help',
              'wordcount',
            ],
            menubar: 'file edit view insert format tools table custom',
            menu: {
              custom: {
                title: 'Dynamic Data',
                items:
                  'company usermenu campaignmenu masterpayoutmenu contractautomaticmenu contractgeneralmenu contractassetmenu contractassetsgdmenu contractinvoicemenu',
              },
            },
            toolbar:
              'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat image | help',
            // automatic_uploads: false,
            images_upload_url: `${API_URL}/campaign/upload-image-editor/${slug}`,
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

            setup: dynamicMenu,
          }}
          onEditorChange={handleEditorChange}
        />
      </div>
    </>
  )
}

export default ContractEditorForm
