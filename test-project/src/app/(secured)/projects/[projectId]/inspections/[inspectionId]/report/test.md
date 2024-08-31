fetchedInspectionData 
  {
    id: '6683a32b46baae76f49f2bff',
    refNo: '3',
    name: 'Test 3',
    description: 'Test 3',
    type: 'PROGRESS',
    status: 'COMPELETED',
    probeGroupResults: [
      {
        id: '6683a358dbee45f0a8d29c14',
        probeGroupId: '6678d8cbe083ed169fae526e',
        description: 'NEWCREATE|ProbeGroupResult',
        status: 'CREATED',
        probeResults: [Array],
        __typename: 'IbisProbeGroupResult'
      }
    ],
    projectId: '66821413ca094dddb135b0d4',
    __typename: 'IbisInspection'
  }


probegroupResult1 
  {
    id: '6683a358dbee45f0a8d29c14',
    probeGroupId: '6678d8cbe083ed169fae526e',
    description: 'NEWCREATE|ProbeGroupResult',
    status: 'CREATED',
    probeResults: [
      {
        id: '6683a359dbee45f0a8d29c17',
        probeId: '667146549c5005f201a44921',
        resultFileId: '6683aba9dabae097eeb67efc',
        status: 'pass',
        inputFileIds: [Array],
        inputFiles: [Array],
        description: 'All subprobe checks passed ...',
        __typename: 'IbisProbeResult'
      }
    ],
    __typename: 'IbisProbeGroupResult'
  }

ProbeGroup1 
  {
    id: '6672657e1a5122d13b8d1587',
    ownerId: 'c9dac58c-2021-704b-7a11-239b819f4ff8',
    refNo: 'NUS001',
    name: 'PG-MATCH1',
    description: 'contains match type probes',
    isPublic: true,
    probes: [
      {
        id: '6672640c1a5122d13b8d1504',
        ownerId: 'c9dac58c-2021-704b-7a11-239b819f4ff8',
        refNo: 'NUS002',
        name: 'probe2',
        url: 'probe.2.dev.kk',
        description: 'test probe 2',
        fileGroupSetting: [Object],
        isPublic: true,
        type: 'MATCH',
        subprobes: [Array],
        __typename: 'IbisProbe'
      }
    ],
    type: 'MATCH',
    status: 'ACTIVE',
    __typename: 'IbisProbeGroup'
  }
ProbeGroup2 {
  id: '6678d8cbe083ed169fae526e',
  ownerId: 'c9dac58c-2021-704b-7a11-239b819f4ff8',
  refNo: 'NUS-002',
  name: 'PG-PROGRESS',
  description: 'progress ...',
  isPublic: true,
  probes: [
    {
      id: '667146549c5005f201a44921',
      ownerId: 'c9dac58c-2021-704b-7a11-239b819f4ff8',
      refNo: 'NUS001',
      name: 'probe1',
      url: 'probe1.dev.kk',
      description: 'test probe 1',
      fileGroupSetting: [Object],
      isPublic: true,
      type: 'PROGRESS',
      subprobes: [Array],
      __typename: 'IbisProbe'
    }
  ],
  type: 'PROGRESS',
  status: 'ACTIVE',
  __typename: 'IbisProbeGroup'
}
ProbeGroup3 {
  id: '668214ba7fb125c7f97a86ad',
  ownerId: 'c9dac58c-2021-704b-7a11-239b819f4ff8',
  refNo: 'NUS003',
  name: 'test probe url',
  description: '1524513579',
  isPublic: true,
  probes: [
    {
      id: '667e55f8741715f11da288e6',
      ownerId: null,
      refNo: 'NUS-002',
      name: 'probe-002',
      url: 'http://localhost:3000/api/inspection/submitTest',
      description: 'test db procedure',
      fileGroupSetting: [Object],
      isPublic: true,
      type: 'MATCH',
      subprobes: [Array],
      __typename: 'IbisProbe'
    },
    {
      id: '667e55f8741715f11da288da',
      ownerId: null,
      refNo: 'NUS-001',
      name: 'probe-001',
      url: 'http://localhost:3000/api/inspection/submitTest',
      description: 'test db procedure',
      fileGroupSetting: [Object],
      isPublic: true,
      type: 'MATCH',
      subprobes: [Array],
      __typename: 'IbisProbe'
    }
  ],
  type: 'MATCH',
  status: 'ACTIVE',
  __typename: 'IbisProbeGroup'
}
ProbeGroup4 {
  id: '66825ec643d054e344e10635',
  ownerId: 'c9dac58c-2021-704b-7a11-239b819f4ff8',
  refNo: 'DEV-001',
  name: 'DevTest-001',
  description: '54332432486',
  isPublic: true,
  probes: [
    {
      id: '66825ea03702e45c8a227036',
      ownerId: 'c9dac58c-2021-704b-7a11-239b819f4ff8',
      refNo: 'DEV-001',
      name: 'DEV-001',
      url: 'https://testshiyi.dh2ddtk39bfwm.amplifyapp.com/api/inspection/submitTest',
      description: 'used for dev test',
      fileGroupSetting: [Object],
      isPublic: true,
      type: 'MATCH',
      subprobes: [Array],
      __typename: 'IbisProbe'
    }
  ],
  type: 'MATCH',
  status: 'ACTIVE',
  __typename: 'IbisProbeGroup'
}
ProbeGroup5 {
  id: '66837abb4e3730beae7a30d3',
  ownerId: 'c9dac58c-2021-704b-7a11-239b819f4ff8',
  refNo: 'KK-001',
  name: 'kk-001',
  description: "use kk's api url",
  isPublic: true,
  probes: [
    {
      id: '66837a341def16dd1332d524',
      ownerId: 'c9dac58c-2021-704b-7a11-239b819f4ff8',
      refNo: 'KK-001',
      name: 'KK-001',
      url: 'https://pp57cudqsb.execute-api.ap-southeast-1.amazonaws.com/probe/v1/dummy_result/betekk-dummy-probe-1',
      description: "use kk's api url",
      fileGroupSetting: [Object],
      isPublic: true,
      type: 'MATCH',
      subprobes: [Array],
      __typename: 'IbisProbe'
    }
  ],
  type: 'MATCH',
  status: 'ACTIVE',
  __typename: 'IbisProbeGroup'
}