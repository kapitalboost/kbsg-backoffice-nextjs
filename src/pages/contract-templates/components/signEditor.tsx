import { dynamicMenu } from '@/utils/dynamicData'
import { Editor } from '@tinymce/tinymce-react'
import { Button, Grid } from 'antd'
import { useEffect, useState } from 'react'
import SignaturePosition from '../components/signaturePosition'
import { EditTwoTone, FormOutlined } from '@ant-design/icons'

const { useBreakpoint } = Grid

const tiny_api_key = process.env.NEXT_PUBLIC_TINY_KEY

interface MainProps {
  user: any
  content: string
  onChangeContent: any
  contractTemplate: any
}

const ContractEditorSignForm = ({
  user,
  content,
  onChangeContent,
  contractTemplate,
}: MainProps) => {
  const [loading, setLoading] = useState(true)
  const [signPositionPupup, setSignPositionPopup] = useState(false)

  const screens = useBreakpoint()

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
        <div style={{ textAlign: 'right' }}>
          <Button
            className="mb-1"
            size="small"
            icon={<FormOutlined />}
            onClick={() => setSignPositionPopup(true)}
            disabled={!screens.xl}
          >
            Sign Position
          </Button>
        </div>

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
              'removeformat | help',
            content_style:
              'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

            setup: dynamicMenu,
          }}
          onEditorChange={handleEditorChange}
        />
      </div>

      <SignaturePosition
        user={user}
        contractTemplate={contractTemplate}
        handleCancel={() => setSignPositionPopup(false)}
        isModalOpen={signPositionPupup}
        signatureContent={content}
        signerJson={null}
      />
    </>
  )
}

export default ContractEditorSignForm
