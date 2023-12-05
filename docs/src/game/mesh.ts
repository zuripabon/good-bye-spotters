import Mesh from './engine/Mesh'

export const makeChurchMesh = (glContext: WebGLRenderingContext) => Mesh.bo(glContext, 0, "LRGCFB")
