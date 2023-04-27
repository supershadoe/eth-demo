<script>
    import "../app.css";
</script>

<div class="app font-sans flex flex-col min-h-screen justify-between">
    <a href="#main" class="link-base-content left-0 absolute p-3 m-3 mt-16
    -translate-y-28 focus:translate-y-0">Skip to main content</a>
    <header>
        <nav class="h-16 flex bg-black">
            <a class="btn btn-ghost text-xl normal-case tracking-wide text-amber-300 m-auto" href="/">
                SASTRA Shop
            </a>
        </nav>
    </header>
    <main id="main">
        <slot />
    </main>
    <div />
</div>
