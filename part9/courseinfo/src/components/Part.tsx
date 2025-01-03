import { CoursePart } from '../types';

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const Part = (props: PartProps) => {
  switch (props.part.kind) {
    case 'basic':
      return (
        <div style={{ marginBottom: '1em' }}>
          <div>
            <b>
              {props.part.name} {props.part.exerciseCount}
            </b>
          </div>
          <div>{props.part.description}</div>
        </div>
      );
    case 'group':
      return (
        <div style={{ marginBottom: '1em' }}>
          <div>
            <b>
              {props.part.name} {props.part.exerciseCount}
            </b>
          </div>
          <div>Group projects: {props.part.groupProjectCount}</div>
        </div>
      );
    case 'background':
      return (
        <div style={{ marginBottom: '1em' }}>
          <div>
            <b>
              {props.part.name} {props.part.exerciseCount}
            </b>
          </div>
          <div>{props.part.description}</div>
          <div>Background material: {props.part.backgroundMaterial}</div>
        </div>
      );
    case 'special':
      return (
        <div style={{ marginBottom: '1em' }}>
          <div>
            <b>
              {props.part.name} {props.part.exerciseCount}
            </b>
          </div>
          <div>{props.part.description}</div>
          <div>Requirements: {props.part.requirements.join(', ')}</div>
        </div>
      );
    default:
      return assertNever(props.part);
  }
};

export default Part;
