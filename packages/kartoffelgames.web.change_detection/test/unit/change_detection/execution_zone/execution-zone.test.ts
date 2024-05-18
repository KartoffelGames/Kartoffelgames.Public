import { expect } from 'chai';
import { ExecutionZone } from '../../../../source/change_detection/execution_zone/execution-zone';
import '../../../mock/request-animation-frame-mock-session';
import { ChangeReason } from '../../../../source';
import { ChangeDetectionReason } from '../../../../source/change_detection/change-detection-reason';
import { DetectionCatchType } from '../../../../source/change_detection/enum/detection-catch-type.enum';

describe('ExecutionZone', () => {
   it('Static Property: current', () => {
      // Process.
      const lCurrentZone: ExecutionZone = ExecutionZone.current;

      // Evaluation.
      expect(lCurrentZone.name).to.equal('Default');
   });

   describe('Static Method: dispatchInteractionEvent', () => {
      it('-- Passthrough change reason', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('ZoneName');
         const lReason: ChangeDetectionReason = new ChangeDetectionReason(DetectionCatchType.Syncron, {});

         // Process.
         let lResultReason: ChangeDetectionReason | null = null;
         lZone.addInteractionListener((pChangeReason: ChangeReason) => {
            lResultReason = pChangeReason;
         });
         lZone.executeInZone(() => {
            ExecutionZone.dispatchInteractionEvent(lReason);
         });

         // Evaluation.
         expect(lResultReason).to.equal(lReason);
      });

      it('-- Inore other zones.', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('ZoneName');
         const lZoneDifferent: ExecutionZone = new ExecutionZone('ZoneName1');
         const lReason: ChangeDetectionReason = new ChangeDetectionReason(DetectionCatchType.Syncron, {});

         // Process.
         let lResultReason: ChangeDetectionReason | null = null;
         lZone.addInteractionListener((pChangeReason: ChangeReason) => {
            lResultReason = pChangeReason;
         });
         lZoneDifferent.executeInZone(() => {
            ExecutionZone.dispatchInteractionEvent(lReason);
         });

         // Evaluation.
         expect(lResultReason).to.be.null;
      });
   });

   it('Property: name', () => {
      // Setup.
      const lZoneName: string = 'ZoneName';
      const lZone: ExecutionZone = new ExecutionZone(lZoneName);

      // Process.
      const lNameResult: string = lZone.name;

      // Evaluation.
      expect(lNameResult).to.equal(lZoneName);
   });

   it('Method: addInteractionListener', () => {
      // Setup.
      const lZone: ExecutionZone = new ExecutionZone('ZoneName');
      const lSource = {};

      // Process.
      let lResultSource: any;
      lZone.addInteractionListener((pChangeReason: ChangeReason) => {
         lResultSource = pChangeReason.source;
      });
      lZone.executeInZone(() => {
         ExecutionZone.dispatchInteractionEvent(new ChangeDetectionReason(DetectionCatchType.SyncronCall, lSource));
      });

      // Evaluation.
      expect(lResultSource).to.equal(lSource);
   });

   describe('Method: executeInZone', () => {
      it('-- Execute inside zone', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResult: string | null = null;
         lZone.executeInZone(() => {
            lZoneNameResult = ExecutionZone.current.name;
         });

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
      });

      it('-- Execute inside zone with parameter', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('Name');
         const lExecutionResult: string = 'ExecutionResult';

         // Process.
         const lResult: string = lZone.executeInZone((pParameter: string) => {
            return pParameter;
         }, lExecutionResult);

         // Evaluation.
         expect(lResult).to.equal(lExecutionResult);
      });

      it('-- Execute inside zone with error', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);
         const lError: string = 'ErrorName';

         // Process.
         let lZoneNameResult: string | null = null;
         let lErrorResult: string | null = null;
         try {
            lZone.executeInZone(() => {
               lZoneNameResult = ExecutionZone.current.name;
               throw lError;
            });
         } catch (pError) {
            lErrorResult = <string>pError;
         }

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
         expect(lErrorResult).to.equal(lError);
      });

      it('-- Error inside zone, ensure correct zones', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResultFunktion: string | null = null;
         let lZoneNameResultException: string | null = null;
         const lZoneNameResultBefore = ExecutionZone.current.name;
         try {
            lZone.executeInZone(() => {
               lZoneNameResultFunktion = ExecutionZone.current.name;
               throw '';
            });
         } catch (pError) {
            lZoneNameResultException = ExecutionZone.current.name;
         }
         const lZoneNameResultAfter = ExecutionZone.current.name;

         // Evaluation.
         expect(lZoneNameResultBefore).to.equal('Default');
         expect(lZoneNameResultFunktion).to.equal(lZoneName);
         expect(lZoneNameResultException).to.equal('Default');
         expect(lZoneNameResultAfter).to.equal('Default');
      });

      it('-- Check interaction callback', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);
         const lFunction = () => { /* Empty */ };

         // Process.
         let lExecutedFunction: any;
         lZone.addInteractionListener((pChangeReason: ChangeReason) => {
            // lZoneNameResult = pZoneName; TODO: Add zone or cd identifier to reason.
            lExecutedFunction = pChangeReason.source;
         });
         lZone.executeInZone(() => {
            ExecutionZone.dispatchInteractionEvent(new ChangeDetectionReason(DetectionCatchType.SyncronCall, lFunction));
         });


         // Evaluation.
         // expect(lZoneNameResult).to.equal(lZoneName);
         expect(lExecutedFunction).to.equal(lFunction);
      });
   });

   describe('Method: executeInZoneSilent', () => {
      it('-- Execute inside zone', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResult: string | null = null;
         lZone.executeInZone(() => {
            lZoneNameResult = ExecutionZone.current.name;
         });

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
      });

      it('-- Execute inside zone with parameter', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('Name');
         const lExecutionResult: string = 'ExecutionResult';

         // Process.
         const lResult: string = lZone.executeInZone((pParameter: string) => {
            return pParameter;
         }, lExecutionResult);

         // Evaluation.
         expect(lResult).to.equal(lExecutionResult);
      });

      it('-- Execute inside zone with error', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);
         const lError: string = 'ErrorName';

         // Process.
         let lZoneNameResult: string | null = null;
         let lErrorResult: string | null = null;
         try {
            lZone.executeInZone(() => {
               lZoneNameResult = ExecutionZone.current.name;
               throw lError;
            });
         } catch (pError) {
            lErrorResult = <string>pError;
         }

         // Evaluation.
         expect(lZoneNameResult).to.equal(lZoneName);
         expect(lErrorResult).to.equal(lError);
      });

      it('-- Error inside zone, ensure correct zones', () => {
         // Setup.
         const lZoneName: string = 'ZoneName';
         const lZone: ExecutionZone = new ExecutionZone(lZoneName);

         // Process.
         let lZoneNameResultFunktion: string | null = null;
         let lZoneNameResultException: string | null = null;
         const lZoneNameResultBefore = ExecutionZone.current.name;
         try {
            lZone.executeInZone(() => {
               lZoneNameResultFunktion = ExecutionZone.current.name;
               throw '';
            });
         } catch (pError) {
            lZoneNameResultException = ExecutionZone.current.name;
         }
         const lZoneNameResultAfter = ExecutionZone.current.name;

         // Evaluation.
         expect(lZoneNameResultBefore).to.equal('Default');
         expect(lZoneNameResultFunktion).to.equal(lZoneName);
         expect(lZoneNameResultException).to.equal('Default');
         expect(lZoneNameResultAfter).to.equal('Default');
      });

      it('-- Check interaction callback', () => {
         // Setup.
         const lZone: ExecutionZone = new ExecutionZone('ZoneName');

         // Process.
         let lInteractionCallbackCalled: boolean = false;
         lZone.addInteractionListener(() => {
            lInteractionCallbackCalled = true;
         });
         lZone.executeInZone(() => { /* Empty */ });

         // Evaluation.
         expect(lInteractionCallbackCalled).to.be.false;
      });
   });
});