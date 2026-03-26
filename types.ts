export enum Topic {
  Tetrahedron = 'Tetrahedron',
  Pyramid = 'Pyramid',
  DihedralAngle = 'DihedralAngle',
  ThreePerpendiculars = 'ThreePerpendiculars',
  CoordinateSystem = 'CoordinateSystem',
  PlaneIntersections = 'PlaneIntersections',
  FoldingRectangle = 'FoldingRectangle',
  FoldingSquare = 'FoldingSquare',
  OctahedronInCube = 'OctahedronInCube',
  StellaOctangula = 'StellaOctangula',
  CubeCrossSection = 'CubeCrossSection' // 新增這行
}

export interface TopicInfo {
  id: Topic;
  title: string;
  description: string;
}
