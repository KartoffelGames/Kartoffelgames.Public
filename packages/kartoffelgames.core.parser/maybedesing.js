// Process.
lParser.defineGraphPart('branch',
    lParser.graph().single('modifier', TokenType.Modifier)
);


// Setup. Define graph part and set as root.
lParser.defineGraphPart('LoopCode',
    lParser.graph().optional('optional', TokenType.Modifier).optional(lParser.partReference('LoopCode')),
    (pData: any) => {
        return pData;
    }
);