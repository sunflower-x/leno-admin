import { DataTypes } from 'sequelize'
import seq from '@/mysql/db/seq.db'

// 创建数据库模型
const Gen = seq.define(
  'tool_gen',
  {
    table_id: {
      type: DataTypes.BIGINT,
      allowNull: false, // 是否允许空
      unique: true, // 是否为独一无二的
      autoIncrement: true, // id 自动增加
      primaryKey: true, // 是否设置为主键
      comment: '编号'
    },
    table_name: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '表名称'
    },
    table_comment: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '表描述'
    },
    sub_table_name: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '关联子表的表名'
    },
    sub_table_fk_name: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '子表关联的外键名'
    },
    class_name: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '实体类名称'
    },
    tpl_category: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '使用的模板（crud单表操作 tree树表操作）'
    },
    package_name: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '生成包路径'
    },
    module_name: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '生成模块名'
    },
    business_name: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '生成业务名'
    },
    function_name: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '生成功能名'
    },
    function_author: {
      type: DataTypes.CHAR(200),
      defaultValue: '',
      comment: '生成功能作者'
    },
    gen_type: {
      type: DataTypes.CHAR(1),
      defaultValue: '0',
      comment: '生成代码方式（0zip压缩包 1自定义路径）'
    },
    gen_path: {
      type: DataTypes.CHAR(200),
      defaultValue: '/',
      comment: '生成路径（不填默认项目路径）'
    },
    options: {
      type: DataTypes.CHAR(1000),
      defaultValue: '0',
      comment: '其它生成选项'
    },
    remark: {
      type: DataTypes.CHAR(500),
      defaultValue: '',
      comment: '备注'
    },
    create_by: {
      type: DataTypes.CHAR(64),
      defaultValue: null,
      comment: '创建者'
    },
    update_by: {
      type: DataTypes.CHAR(64),
      defaultValue: null,
      comment: '更新者'
    }
  },
  {
    tableName: 'tool_gen', // 强制创建表名
    freezeTableName: true // 告诉sequelize不需要自动将表名变成复数
  }
)

export default Gen