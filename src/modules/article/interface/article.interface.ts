export interface Article {
  id?: ''; // id
  title: ''; // 标题
  description: ''; // 描述
  category: '';
  tags: [];
  contentHtml: ''; // content
  createTime?: ''; // 创建时间
  updateTime?: ''; // 更新时间
  isDelete?: ''; // 是否删除
}
