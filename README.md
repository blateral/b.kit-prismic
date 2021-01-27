# b.kit Prismic

This package provides an interface to connect b.kit components with the Prismic CMS. To do so it defines slices that can be imported and used inside e.g. in a react nextjs project.

## Local Testing

Inside library project:

-   Install yalc globally: `yarn global add yalc`
-   Run `yalc publish` to publish library into local yalc store.

Inside project that should use the library:

-   Run `yalc add <repository-name>` in target lokal repository to link library from yalc store.
-   Use `yalc update` or `yalc update <repository-name>` to update all linked packages
-   use `yalc remove <repository-name>` to remove linked package
