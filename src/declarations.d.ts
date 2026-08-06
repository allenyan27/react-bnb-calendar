/**
 * Type declarations for SCSS/CSS Modules.
 * Allows TypeScript to import *.module.scss and *.module.css files without errors.
 */

declare module "*.module.scss" {
    const classes: { readonly [key: string]: string };
    export default classes;
}

declare module "*.module.css" {
    const classes: { readonly [key: string]: string };
    export default classes;
}
