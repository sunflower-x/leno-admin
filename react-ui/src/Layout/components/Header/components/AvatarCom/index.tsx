import { useEffect, useState } from 'react'
import {
  Avatar,
  Dropdown,
  message,
  Modal,
  Drawer,
  Row,
  Col,
  Button,
  Switch,
  ConfigProvider,
  Popover,
} from 'antd'
import { useNavigate } from 'react-router-dom'
import avatar from '@/assets/images/avatar.jpeg'
import useStore from '@/store'
import { HOME_URL } from '@/config/config'
import { observer } from 'mobx-react-lite'
import type { MenuProps } from 'antd'
import { removeToken } from '@/utils/auth'
import { logoutAPI } from '@/api/modules/user'
import {
  ExclamationCircleTwoTone,
  SyncOutlined,
  FileAddOutlined,
  CheckOutlined,
  DownOutlined,
} from '@ant-design/icons'
import classess from './index.module.scss'
import { SketchPicker } from 'react-color'

const avatarCom = () => {
  const navigate = useNavigate()
  const {
    useUserStore: { removeUserInfo, userInfo },
    useLayoutStore: { changeTabsListMobx, layoutSet, setLayoutSet },
  } = useStore()

  const [isOpen, setIsOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('layout-set')) {
      const layoutSet = JSON.parse(localStorage.getItem('layout-set') as string)
      setLayoutSet(layoutSet)
      ConfigProvider.config({
        theme: { primaryColor: layoutSet.theme },
      })
    }
  }, [])

  const handleOk = async () => {
    await logoutAPI()
    setConfirmLoading(true)
    removeToken()
    removeUserInfo()
    changeTabsListMobx([{ path: HOME_URL, title: '首页' }])
    navigate('/login')
    message.success('退出登录成功')
  }

  const onClose = () => {
    setOpen(false)
  }

  const items: MenuProps['items'] = [
    {
      key: 'name',
      label: <div style={{ color: '#b2aeae', userSelect: 'none' }}>{userInfo.userName}</div>,
      type: 'group',
    },
    {
      type: 'divider',
    },
    {
      key: '1',
      label: <span>首页</span>,
      onClick: () => navigate(HOME_URL),
    },
    {
      key: '2',
      label: <span>个人中心</span>,
      onClick: () => navigate('/profile'),
    },
    {
      key: '3',
      label: <span>布局设置</span>,
      onClick: () => setOpen(true),
    },
    {
      type: 'divider',
    },
    {
      key: '4',
      label: <span>退出登录</span>,
      onClick: () => {
        setIsOpen(true)
        setTimeout(() => {
          setIsOpen(false)
          setConfirmLoading(false)
        }, 5000)
      },
    },
  ]

  // 主题风格设置
  const selectTheme = (e: any) => {
    setLayoutSet({ headerTheme: e.target.id })
  }

  const onColorChange = (nextColor: string) => {
    setLayoutSet({ theme: nextColor })
    ConfigProvider.config({
      theme: { primaryColor: nextColor },
    })
  }

  // switch 处理事件
  const handleChange = (value: boolean, name: string) => {
    setLayoutSet({ [name]: value })
  }

  // 保存配置
  const saveConfiguration = () => {
    localStorage.setItem('layout-set', JSON.stringify(layoutSet))
    message.success('保存成功')
  }

  // 重置配置
  const resetConfiguration = () => {
    localStorage.removeItem('layout-set')
    location.reload()
  }

  return (
    <div style={{ marginLeft: 16 }}>
      <Dropdown
        trigger={['click']}
        menu={{ items }}
        placement="bottomLeft"
        arrow={{ pointAtCenter: true }}
      >
        <Avatar size="default" src={userInfo.avatar ? userInfo.avatar : avatar} />
      </Dropdown>
      <Modal
        title="提示"
        open={isOpen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setIsOpen(false)}
      >
        <p>
          <ExclamationCircleTwoTone style={{ marginRight: 10 }} />
          {`确认退出系统吗？`}
        </p>
      </Modal>

      {/* 布局设置 */}
      <Drawer
        title={false}
        placement="right"
        onClose={onClose}
        open={open}
        closable={false}
        className={classess['layout-drawer']}
      >
        <h3 className={classess['title']}>主题风格设置</h3>

        <Row className={classess['theme']} onClick={selectTheme}>
          <Col id="pink" className={`${classess['theme-square']} ${classess['pink']}`}>
            <CheckOutlined
              hidden={layoutSet.headerTheme !== 'pink'}
              style={{ color: 'white', fontSize: 18 }}
            />
          </Col>
          <Col id="darkGreen" className={`${classess['theme-square']} ${classess['darkGreen']}`}>
            <CheckOutlined
              hidden={layoutSet.headerTheme !== 'darkGreen'}
              style={{ color: 'white', fontSize: 18 }}
            />
          </Col>
          <Col
            id="cornflowerBlue"
            className={`${classess['theme-square']} ${classess['cornflowerBlue']}`}
          >
            <CheckOutlined
              hidden={layoutSet.headerTheme !== 'cornflowerBlue'}
              style={{ color: 'white', fontSize: 18 }}
            />
          </Col>
          <Col id="goldenrod" className={`${classess['theme-square']} ${classess['goldenrod']}`}>
            <CheckOutlined
              hidden={layoutSet.headerTheme !== 'goldenrod'}
              style={{ color: 'white', fontSize: 18 }}
            />
          </Col>
          <Col id="darkBlue" className={`${classess['theme-square']} ${classess['darkBlue']}`}>
            <CheckOutlined
              hidden={layoutSet.headerTheme !== 'darkBlue'}
              style={{ color: 'white', fontSize: 18 }}
            />
          </Col>
        </Row>

        <Row className={classess['base-layout']} justify="space-between">
          <Col>主题颜色</Col>

          <Col className={classess['theme-color']}>
            <Popover
              content={
                <SketchPicker
                  presetColors={['#1890ff', '#25b864', '#ff6f00', '#13c2c2', '#6959cd', '#212121']}
                  color={layoutSet.theme}
                  onChange={({ hex }) => {
                    onColorChange(hex)
                  }}
                />
              }
              trigger="click"
            >
              <Button type="primary" icon={<DownOutlined />} size="small" />
            </Popover>
          </Col>
        </Row>
        <hr />
        <h3 className={classess['title']}>系统布局配置</h3>
        <Row className={classess['base-layout']} justify="space-between">
          <Col>开启 Tags-Views</Col>
          <Col>
            <Switch
              checked={layoutSet.tagsView}
              onChange={(value) => {
                handleChange(value, 'tagsView')
              }}
            />
          </Col>
        </Row>
        <Row className={classess['base-layout']} justify="space-between">
          <Col>固定 Header</Col>
          <Col>
            <Switch
              checked={layoutSet.fixedHeader}
              onChange={(value) => {
                handleChange(value, 'fixedHeader')
              }}
            />
          </Col>
        </Row>
        <Row className={classess['base-layout']} justify="space-between">
          <Col>显示 Logo</Col>
          <Col>
            <Switch
              checked={layoutSet.sidebarLogo}
              onChange={(value) => {
                handleChange(value, 'sidebarLogo')
              }}
            />
          </Col>
        </Row>
        <Row className={classess['base-layout']} justify="space-between">
          <Col>动态标题</Col>
          <Col>
            <Switch
              checked={layoutSet.dynamicTitle}
              onChange={(value) => {
                handleChange(value, 'dynamicTitle')
              }}
            />
          </Col>
        </Row>
        <hr />

        <Row gutter={12}>
          <Col>
            <Button onClick={saveConfiguration} icon={<FileAddOutlined />} type="primary">
              保存配置
            </Button>
          </Col>
          <Col>
            <Button onClick={resetConfiguration} icon={<SyncOutlined />}>
              重置配置
            </Button>
          </Col>
        </Row>
      </Drawer>
    </div>
  )
}
export default observer(avatarCom)