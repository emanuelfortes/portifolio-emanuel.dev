/**
 * Catálogo de permissões da plataforma.
 *
 * Correção 5.2 do documento de arquitetura: nenhum poder de papel vive no código.
 * O backend só pergunta `can(user, PERMISSIONS.TASK_EDIT_ANY)`.
 * Trocar o que um coordenador pode fazer é um INSERT em `role_permissions`,
 * nunca um deploy.
 */
export const PERMISSIONS = {
  // Demandas
  TASK_VIEW_ALL: 'task:view_all',
  TASK_EDIT_ANY: 'task:edit_any',
  TASK_DELETE: 'task:delete',
  TASK_ASSIGN_ANY: 'task:assign_any',

  // Clientes
  CLIENT_MANAGE: 'client:manage',

  // Configuração
  DELEGATION_MANAGE: 'delegation:manage',
  USER_MANAGE: 'user:manage',
  ROLE_MANAGE: 'role:manage',
  TASK_TYPE_MANAGE: 'task_type:manage',
  EVENT_MANAGE: 'event:manage',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const PERMISSION_DESCRIPTIONS: Record<Permission, string> = {
  [PERMISSIONS.TASK_VIEW_ALL]: 'Ver demandas de toda a equipe',
  [PERMISSIONS.TASK_EDIT_ANY]: 'Editar e mudar status de qualquer demanda',
  [PERMISSIONS.TASK_DELETE]: 'Excluir demandas',
  [PERMISSIONS.TASK_ASSIGN_ANY]: 'Atribuir demanda a qualquer pessoa, ignorando a matriz',
  [PERMISSIONS.CLIENT_MANAGE]: 'Criar e editar clientes e seus perfis',
  [PERMISSIONS.DELEGATION_MANAGE]: 'Editar a matriz de delegação',
  [PERMISSIONS.USER_MANAGE]: 'Criar, editar e desativar usuários',
  [PERMISSIONS.ROLE_MANAGE]: 'Criar e editar funções',
  [PERMISSIONS.TASK_TYPE_MANAGE]: 'Criar e editar tipos de demanda',
  [PERMISSIONS.EVENT_MANAGE]: 'Criar e editar eventos do calendário',
}

/** Slugs das funções que vêm no seed. Novas funções são criadas em runtime. */
export const ROLE_SLUGS = {
  COORDENADOR: 'coordenador',
  DESENVOLVEDOR: 'desenvolvedor',
  DESIGN_GRAFICO: 'design_grafico',
  EDITOR_VIDEO: 'editor_video',
  GESTOR_TRAFEGO: 'gestor_trafego',
  ESTRATEGISTA_SOCIAL: 'estrategista_social',
  JORNALISTA: 'jornalista',
} as const

export type RoleSlug = (typeof ROLE_SLUGS)[keyof typeof ROLE_SLUGS]
