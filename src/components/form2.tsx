import {FieldValues, useForm} from "react-hook-form";

const Foorm = () => {
    const {register,handleSubmit,formState:{errors}} = useForm();
    

    const onSubmit=(data: FieldValues) => console.log ( data);
    

  return (
    <form onSubmit={handleSubmit (onSubmit)}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">
          Name
        </label>
        <input
          {...register('name',{required: true, minLength:3})}
          id="name"
          type="text"
          className="form-control"       
        
        />
        { errors.name?.type === 'required' && <p className ="text-danger"> the name is required</p>}
        { errors.name?.type === 'minLength' && <p> the lenght is too short</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="age" className="form-label">
          Age
        </label>
        <input
          {...register('age')}
          id="age"
          type="number"
          className="form-control"
        />
      </div>

      <button className="btn btn-primary">Submit</button>
    </form>
  );
};

export default Foorm;
