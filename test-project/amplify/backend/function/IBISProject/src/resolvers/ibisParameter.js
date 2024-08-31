import { IbisParameterController } from "@myorg/ibis-mongodb";

async function listAllParameters(inputs) {
    const { subprobeId } = inputs;
    return await IbisParameterController.listParameters(subprobeId);
}

async function createParameter(inputs) {
    const { ownerId, name, value, type, minThreshold, maxThreshold, unit, valueType, isIncludedValue, subProbeId } = inputs;
    const createdParameter = await IbisParameterController.createParameter({
        ownerId: ownerId,
        name: name,
        value: value,
        type: type,
        minT: minThreshold,
        maxT: maxThreshold,
        unit: unit,
        valueType: valueType,
        isIncludedValue: isIncludedValue,
        subProbeId: subProbeId,
    });
    return createdParameter._id;
}

async function updateParameter(inputs) {
    const { id, parameterName, paramterValue, paramterType, minThreshold, maxThreshold, Unit, valueType, valueIncluded } = inputs;
    await IbisParameterController.updateParameterById(id, { name: parameterName, value: paramterValue, type: paramterType, minT: minThreshold, maxT: maxThreshold, unit: Unit, valueType: valueType, valueIncluded: valueIncluded });
    return id;
}

async function deleteParameterById(inputs) {
    const { deleteId } = inputs;
    await IbisParameterController.deleteParameterById(deleteId);
    return deleteId;
}

export { listAllParameters, createParameter, updateParameter, deleteParameterById };