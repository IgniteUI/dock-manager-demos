import { projects } from '../project-config.ts';

export interface IsampleItem {
    label: string;
    /**
     * If the icon is an SVG string, svg holds it; otherwise icon holds the registry name.
     */
    icon?: string;
    svg?: string;
    collection?: string;
    route: string;
}

// Generate navigation from the project registry
export const sampleItems: IsampleItem[] = projects.map(project => {
    const isSvg = !!project.icon && project.icon.trim().startsWith('<svg');
    return {
        label: project.name,
        icon: !isSvg ? (project.icon || 'project_fallback') : undefined,
        svg: isSvg ? project.icon : undefined,
        collection: 'material',
        route: `/projects/${project.id}`
    };
});
