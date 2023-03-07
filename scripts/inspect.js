
const createModelViewerList = (length) => {
    // 가로로 나열합니다.
    const list = document.createElement('div');
    list.style.display = 'flex';
    list.style.flexDirection = 'row';
    list.style.flexWrap = 'wrap';
    list.style.justifyContent = 'space-evenly';
    list.style.padding = '0';
    list.style.margin = '0';
    list.style.listStyle = 'none';
    // 화면 전체를 차지합니다.
    list.style.width = '100vw';

    const modelViewers = [];
    const width = 100 / (length + .5);
    for (let i = 0; i < length; i++) {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.width = `${width}vw`;
        div.style.height = '40vh';

        div.style.padding = '0';
        div.style.margin = '0';
        div.style.border = '1px solid #ccc';
        div.style.borderRadius = '4px';
        div.style.boxShadow = '0 0 4px 0 rgba(0, 0, 0, 0.2)';

        // onclick시 테두리를 빨간색으로 변경합니다.
            // div.addEventListener('click', (event) => {
            //     const target = event.target;
            //     if (target.style.border === '2px solid red') {
            //         target.style.border = '1px solid #ccc';
            //     } else {
            //         target.style.border = '2px solid red';
            //     }
            // });


        // model viewer
        const model = document.createElement('model-viewer');
        model.style.width = '100%';
        model.style.height = '100%';
        model.cameraControls = false;
        model.shadowIntensity = 1;
        model.interactionPrompt = 'none';
        //model.minFieldOfView = '0deg';

        model.ondrop = (event) => {
            loadDroppedModel(event);
        };
        model.ondragover = (event) => {
            dragover_handler(event);
        };

        // hdri
        // model.skyboxImage = './Studio.hdr';
        // model.shadowIntensity = 1;
        model.disablePan = true;
        // model.minFieldOfView = '0deg';

        div.appendChild(model);

        list.appendChild(div);
        modelViewers.push(model);
    }
    modelViewers[0].cameraControls = true;
    return [list, modelViewers];
}

const deriveCameraEvents = (original, deriveds) => {
    original.addEventListener('camera-change', (event) => {
        console.log(`camera-change`)
        const { theta, phi, radius } = original.getCameraOrbit();
        const fov = original.getFieldOfView();
        const rad = `${theta}rad ${phi}rad ${radius}m`;
        const target = original.getCameraTarget();
        const {x, y, z} = target;
        const targetString = `${x}m ${y}m ${z}m`;

        for (const derived of deriveds) {
            derived.cameraOrbit = rad;
            derived.fieldOfView = `${fov}deg`;
        }
    });
}

// hdri를 변경할 수 있는 드롭다운을 생성합니다.
const createHdriDropdown = (modelViewers) => {
    const hdriDropdown = document.createElement('select');
    hdriDropdown.style.position = 'fixed';
    hdriDropdown.style.top = '0';
    hdriDropdown.style.right = '0';
    hdriDropdown.style.zIndex = '100';
    hdriDropdown.style.padding = '4px';
    hdriDropdown.style.margin = '4px';
    hdriDropdown.style.border = '1px solid #ccc';
    hdriDropdown.style.borderRadius = '4px';
    hdriDropdown.style.boxShadow = '0 0 4px 0 rgba(0, 0, 0, 0.2)';

    const hdriList = [
        { name: 'Neutral', path: '../hdri/neutral.hdr' },
        { name: 'Apls', path: '../hdri/alps-field.hdr' },
        { name: 'Studio', path: '../hdri/Studio.hdr' },
        { name: 'Pure sky', path: '../hdri/pure-sky.hdr' },
    ];

    for (const hdri of hdriList) {
        const option = document.createElement('option');
        option.value = hdri.path;
        option.innerText = hdri.name;
        hdriDropdown.appendChild(option);
    }

    hdriDropdown.addEventListener('change', (event) => {
        const path = event.target.value;
        for (const model of modelViewers) {
            model.skyboxImage = path;
        }
    });

    return hdriDropdown;
}

const createModelViewer = (column) => {
    const viewer = document.getElementById('ohouse-model-viewer');
    // create hdri dropdown
    const hdriDropdown = document.createAttribute('div');
    const allModelViewers = [];
    for (let i = 0; i < column; i++) {
        const [list, modelViewers] = createModelViewerList(4)
        viewer.appendChild(list);
        deriveCameraEvents(modelViewers[0], modelViewers.slice(1));
        allModelViewers.push(...modelViewers);
    }
    document.body.appendChild(createHdriDropdown(allModelViewers));
}



/** drag */
function dragover_handler(ev) {
    ev.preventDefault();
}

function loadDroppedModel(event) {
    event.preventDefault();
    let fileData = event.dataTransfer.getData("model/gltf-binary")
    let file = event.dataTransfer.files[0]
    if (!file.name.match(/\.(gltf|glb)$/)) {
        alert("This isn't a .gltf or .glb, can't load this file.")
        return;
    }
    if (event.dataTransfer.files.length > 1) {
        alert("Whoops, added more than one file, I'll load the first one!")
    }
    let url = URL.createObjectURL(file)
    event.target.src = url
}


window.onload = () => {
    createModelViewer(1);
}