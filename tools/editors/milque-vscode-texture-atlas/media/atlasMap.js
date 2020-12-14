/* global acquireVsCodeApi */
(function main()
{
    const vscode = acquireVsCodeApi();
    window.addEventListener('message', e => {
        const message = e.data;
        switch(message.type)
        {
            case 'update':
                {
                    const model = message.model;
                    update(model);
                    vscode.setState({ model });
                }
                break;
        }
    });

    const UI = {
        sourceImage: document.querySelector('#source'),
        sourcePath: document.querySelector('#sourcePath'),
        viewport: document.querySelector('#viewport'),
        editor: {
            container: document.querySelector('#propertyEditor'),
            title: document.querySelector('#propertyEditor legend'),
            preview: document.querySelector('#propertyEditor .preview'),
            uCoord: document.querySelector('#uCoord'),
            vCoord: document.querySelector('#vCoord'),
            width: document.querySelector('#width'),
            height: document.querySelector('#height'),
            columns: document.querySelector('#columns'),
            rows: document.querySelector('#rows'),
        }
    };
    const CTX = {
        viewport: UI.viewport.getContext('2d'),
        preview: UI.editor.preview.getContext('2d'),
    };
    const SESSION = {
        vscode,
        model: null,
        possibleTargets: [],
        activeTarget: null,
        hoverTargets: [],
        cursorX: -1,
        cursorY: -1,
        grabbing: false,
        grabInitialX: -1,
        grabInitialY: -1,
        grabOffsetX: -1,
        grabOffsetY: -1,
        previewIndex: 0,
        previewDelta: 0, 
        previewSpeed: 0.1,
        animationFrameHandle: null,
        animationFrameListener: null,
        dirty: true,
    };

    function onMouseDown(e)
    {
        if (SESSION.activeTarget)
        {
            let result = pick([], e.clientX, e.clientY, UI.viewport, SESSION);
            if (result.includes(SESSION.activeTarget))
            {
                const boundingRect = e.target.getBoundingClientRect();
                const atlasCoord = SESSION.model[SESSION.activeTarget];
                const dx = Math.floor(e.clientX - boundingRect.x);
                const dy = Math.floor(e.clientY - boundingRect.y);
                SESSION.grabInitialX = atlasCoord.u;
                SESSION.grabInitialY = atlasCoord.v;
                SESSION.grabOffsetX = dx;
                SESSION.grabOffsetY = dy;
                SESSION.grabbing = true;
            }
        }
    }

    function onMouseUp(e)
    {
        redraw(SESSION);

        if (SESSION.grabbing)
        {
            SESSION.grabbing = false;

            const atlasCoord = SESSION.model[SESSION.activeTarget];
            if (SESSION.grabInitialX !== atlasCoord.u || SESSION.grabInitialY !== atlasCoord.v)
            {
                updateAtlasCoord(vscode, SESSION, UI.editor, SESSION.activeTarget, { u: atlasCoord.u, v: atlasCoord.v });
                return;
            }
        }
        
        let result = pick([], e.clientX, e.clientY, UI.viewport, SESSION);
        let nextTarget = result.length > 0 ? result[0] : null;
        if (nextTarget)
        {
            if (result.length > 1)
            {
                let prevTarget = SESSION.activeTarget;
                let i = result.indexOf(prevTarget);
                if (i >= 0 && i < result.length - 1)
                {
                    nextTarget = result[i + 1];
                }
            }
        }
        updateTarget(SESSION, UI.editor, nextTarget);
        SESSION.activeTarget = nextTarget;
        UI.viewport.style.cursor = nextTarget ? 'move' : 'unset';
    }

    function onMouseMove(e)
    {
        redraw(SESSION);

        if (SESSION.grabbing)
        {
            const boundingRect = e.target.getBoundingClientRect();
            const dx = Math.floor(e.clientX - boundingRect.x);
            const dy = Math.floor(e.clientY - boundingRect.y);
            const u = SESSION.grabInitialX - SESSION.grabOffsetX + dx;
            const v = SESSION.grabInitialY - SESSION.grabOffsetY + dy;
            updateAtlasCoord(vscode, SESSION, UI.editor, SESSION.activeTarget, { u, v }, false);
            UI.viewport.style.cursor = 'move';
        }
        else
        {
            SESSION.hoverTargets.length = 0;
            let result = pick(SESSION.hoverTargets, e.clientX, e.clientY, UI.viewport, SESSION);
            if (result.includes(SESSION.activeTarget))
            {
                UI.viewport.style.cursor = 'move';
            }
            else
            {
                UI.viewport.style.cursor = 'unset';
            }
        }
    }

    function onKeyDown(e)
    {
        const { model, activeTarget } = SESSION;
        const moveSpeed = e.repeat ? 4 : 1;
        switch(e.key)
        {
            case 'Tab':
                if (changeActiveFocus(SESSION, UI.editor, e.shiftKey ? -1 : 1))
                {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                break;
            case 'ArrowLeft':
                if (activeTarget)
                {
                    const atlasCoord = model[activeTarget];
                    updateAtlasCoord(vscode, SESSION, UI.editor, activeTarget, { u: atlasCoord.u - moveSpeed });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                break;
            case 'ArrowRight':
                if (activeTarget)
                {
                    const atlasCoord = model[activeTarget];
                    updateAtlasCoord(vscode, SESSION, UI.editor, activeTarget, { u: atlasCoord.u + moveSpeed });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                break;
            case 'ArrowUp':
                if (activeTarget)
                {
                    const atlasCoord = model[activeTarget];
                    updateAtlasCoord(vscode, SESSION, UI.editor, activeTarget, { v: atlasCoord.v - moveSpeed });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                break;
            case 'ArrowDown':
                if (activeTarget)
                {
                    const atlasCoord = model[activeTarget];
                    updateAtlasCoord(vscode, SESSION, UI.editor, activeTarget, { v: atlasCoord.v + moveSpeed });
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
                break;
        }
    }

    UI.viewport.addEventListener('mousedown', onMouseDown);
    UI.viewport.addEventListener('mouseup', onMouseUp);
    UI.viewport.addEventListener('mousemove', onMouseMove);
    UI.viewport.addEventListener('keydown', onKeyDown);

    function onPropertyChange(property, e)
    {
        const target = SESSION.activeTarget;
        if (target)
        {
            const value = Number(e.target.value);
            updateAtlasCoord(vscode, SESSION, UI.editor, target, { [property]: value });
        }
    }

    UI.editor.uCoord.addEventListener('change', e => onPropertyChange('u', e));
    UI.editor.vCoord.addEventListener('change', e => onPropertyChange('v', e));
    UI.editor.width.addEventListener('change', e => onPropertyChange('width', e));
    UI.editor.height.addEventListener('change', e => onPropertyChange('height', e));
    UI.editor.columns.addEventListener('change', e => onPropertyChange('cols', e));
    UI.editor.rows.addEventListener('change', e => onPropertyChange('rows', e));

    function update(model)
    {
        SESSION.model = model;
        SESSION.possibleTargets = Object.keys(model).filter(key => !key.startsWith('__'));
        cancelAnimationFrame(SESSION.animationFrameHandle);
        loop();

        function loop()
        {
            SESSION.animationFrameHandle = requestAnimationFrame(loop);

            if (SESSION.dirty)
            {
                SESSION.dirty = false;
                drawView(CTX.viewport, SESSION, UI.sourceImage, UI.viewport);
            }

            const { activeTarget } = SESSION;
            if (activeTarget)
            {
                updatePreview(SESSION, activeTarget);
                drawPreview(CTX.preview, SESSION, UI.sourceImage, UI.editor.preview);
            }
        }
    }

    // Start the session...
    const prevState = vscode.getState();
    if (prevState) update(prevState.model, prevState.active);
})();

function updatePreview(session, target)
{
    const { model, previewSpeed } = session;
    const atlasCoord = model[target];
    session.previewDelta += previewSpeed;
    let amount = Math.floor(session.previewDelta);
    session.previewDelta -= amount;
    session.previewIndex = (session.previewIndex + amount) % atlasCoord.cols;
}

function redraw(session)
{
    session.dirty = true;
}

function updateTarget(session, editor, targetName)
{
    if (!targetName)
    {
        editor.container.classList.toggle('empty', true);
    }
    else if (targetName in session.model)
    {
        const atlasCoord = session.model[targetName];
        editor.container.classList.toggle('empty', false);
        editor.title.textContent = targetName;
        editor.uCoord.value = atlasCoord.u;
        editor.vCoord.value = atlasCoord.v;
        editor.width.value = atlasCoord.width;
        editor.height.value = atlasCoord.height;
        editor.columns.value = atlasCoord.cols;
        editor.rows.value = atlasCoord.rows;
    }
}

function drawPreview(ctx, session, sourceImage, preview)
{
    const atlasCoord = session.model[session.activeTarget];
    const width = atlasCoord.width;
    const height = atlasCoord.height;
    preview.width = width;
    preview.height = height;
    preview.style.width = `${width}px`;
    preview.style.height = `${height}px`;

    ctx.clearRect(0, 0, width, height);
    let du = (session.previewIndex % atlasCoord.cols) * width;
    let dv = Math.floor(session.previewIndex / atlasCoord.cols) * height;
    ctx.drawImage(sourceImage, atlasCoord.u + du, atlasCoord.v + dv, width, height, 0, 0, width, height);
}

function drawView(ctx, session, sourceImage, viewport)
{
    const { model, activeTarget, hoverTargets, possibleTargets } = session;
    const width = sourceImage.width;
    const height = sourceImage.height;
    viewport.width = width;
    viewport.height = height;
    viewport.style.width = `${width}px`;
    viewport.style.height = `${height}px`;

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(sourceImage, 0, 0, width, height);

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    for(let key of possibleTargets)
    {
        const { u = 0, v = 0, width = 32, height = 32, cols = 1, rows = 1 } = model[key];
        if (activeTarget === key) continue;
        let hover = hoverTargets.includes(key);
        if (hover)
        {

            ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
            ctx.strokeRect(u, v, width * cols, height * rows);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        }
        else
        {
            ctx.strokeRect(u, v, width * cols, height * rows);
        }
    }

    const key = activeTarget;
    if (key)
    {
        const { u = 0, v = 0, width = 32, height = 32, cols = 1, rows = 1 } = model[key];
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
        ctx.strokeRect(u, v, width * cols, height * rows);
    }
}

function updateAtlasCoord(vscode, session, editor, target, values, propagate = true)
{
    redraw(session);

    let atlasCoord = session.model[target];
    if ('u' in values)
    {
        const { u } = values;
        atlasCoord.u = Number(u);
        editor.uCoord.value = u;
    }
    if ('v' in values)
    {
        const { v } = values;
        atlasCoord.v = Number(v);
        editor.vCoord.value = v;
    }
    if ('width' in values)
    {
        const { width } = values;
        atlasCoord.width = Number(width);
        editor.width.value = width;
    }
    if ('height' in values)
    {
        const { height } = values;
        atlasCoord.height = Number(height);
        editor.height.value = height;
    }
    if ('cols' in values)
    {
        const { cols } = values;
        atlasCoord.cols = Number(cols);
        editor.columns.value = cols;
    }
    if ('rows' in values)
    {
        const { rows } = values;
        atlasCoord.rows = Number(rows);
        editor.rows.value = rows;
    }

    if (propagate)
    {
        // TODO: Debounce?
        vscode.postMessage({
            type: 'update',
            target,
            value: values,
        });
    }
}

function moveAtlasCoordBy(vscode, session, editor, target, du, dv)
{
    let atlasCoord = session.model[target];
    updateAtlasCoord(vscode, session, editor, target, { u: atlasCoord.u + du, v: atlasCoord.v + dv });
}

function changeActiveFocus(session, editor, amount = 1)
{
    const { activeTarget, possibleTargets } = session;
    if (possibleTargets.length > 0)
    {
        if (activeTarget)
        {
            let i = possibleTargets.indexOf(activeTarget) + amount;
            if (i >= 0 && i < possibleTargets.length)
            {
                let nextTarget = possibleTargets[i];
                updateTarget(session, editor, nextTarget);
                session.activeTarget = nextTarget;
                redraw(session);
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            let nextTarget = possibleTargets[0];
            updateTarget(session, editor, nextTarget);
            session.activeTarget = nextTarget;
            redraw(session);        
            return true;
        }
    }
    return false;
}

function intersects(cursorX, cursorY, atlasCoord)
{
    const x = atlasCoord.u;
    const y = atlasCoord.v;
    const width = atlasCoord.width * atlasCoord.cols;
    const height = atlasCoord.height * atlasCoord.rows;
    return cursorX >= x && cursorY >= y && cursorX < x + width && cursorY < y + height;
}

function pick(out, clientX, clientY, viewport, session)
{
    const { model, possibleTargets } = session;
    const boundingRect = viewport.getBoundingClientRect();
    const cursorX = session.cursorX = clientX - boundingRect.x;
    const cursorY = session.cursorY = clientY - boundingRect.y;
    for(let key of possibleTargets)
    {
        const atlasCoord = model[key];
        if (intersects(cursorX, cursorY, atlasCoord))
        {
            out.push(key);
        }
    }
    return out;
}
